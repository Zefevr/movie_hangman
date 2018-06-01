import {
  JsonController,
  Authorized,
  CurrentUser,
  Post,
  Param,
  BadRequestError,
  HttpCode,
  Get,
  Patch,
  Body,
  NotFoundError,
  ForbiddenError
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player, Guess } from './entities'
import { io } from '../index'
import { showGuess, isWinner, wrongGuess } from './logic'
import * as request from 'superagent'

const API_KEY = 'd418c8074050f491e00190c7484b0a19'
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=`
const BASE_URL_IMAGES = 'https://image.tmdb.org/t/p/w185'
//api.themoviedb.org/3/discover/movie?api_key=d418c8074050f491e00190c7484b0a19&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=1958

@JsonController()
export default class GameController {
  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(@CurrentUser() user: User) {
    const page = Math.floor(Math.random() * 5) + 1
    const year = 1950 + Math.floor(Math.random() * 68)
    const movie = await request
      .get(`${BASE_URL}${page}&year=${year}`)
      .then(result => {
        return result.body.results[Math.floor(Math.random() * 21)]
      })

    const entity = await Game.create({
      movie: {
        title: movie.title
          .split('')
          .filter(char => char.match(/[ A-Za-z0-9]+/g))
          .join(''),
        overview: movie.overview,
        releaseDate: movie.release_date,
        poster: `${BASE_URL_IMAGES}${movie.poster_path}`
      }
    }).save()

    await Player.create({
      game: entity,
      user,
      symbol: 'x'
    }).save()

    const game = await Game.findOne(entity.id)

    if (!game) throw new BadRequestError(`Game does not exist`)

    const displayTitle = showGuess(game.movie.title, game.guesses)

    const displayGame = { ...game, movie: displayTitle }

    io.emit('action', {
      type: 'ADD_GAME',
      payload: displayGame
    })

    return displayGame
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(@CurrentUser() user: User, @Param('id') gameId: number) {
    const game = await Game.findOne(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending')
      throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()

    const player = await Player.create({
      game,
      user,
      symbol: 'o'
    }).save()

    const updatedGame = await Game.findOne(game.id)

    if (!updatedGame) throw new BadRequestError(`Game does not exist`)

    const displayTitle = showGuess(updatedGame.movie.title, updatedGame.guesses)

    const displayGame = { ...updatedGame, movie: displayTitle }

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: displayGame
    })

    return player
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  async getGame(@Param('id') id: number) {
    const updatedGame = await Game.findOne(id)

    if (!updatedGame) throw new BadRequestError(`Game does not exist`)

    const displayTitle = showGuess(updatedGame.movie.title, updatedGame.guesses)

    const displayGame = { ...updatedGame, movie: displayTitle }

    return displayGame
  }

  @Authorized()
  @Get('/games')
  async getGames() {
    const gamesArray = await Game.find()
    const allGames = gamesArray.map(game => {
      return { ...game, movie: showGuess(game.movie.title, game.guesses) }
    })
    return allGames
  }

  @Authorized()
  @Patch('/games/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() guess: Guess
  ) {
    console.log(`Game ID: ${gameId}, Guess: ${guess.guess}`)

    const game = await Game.findOne(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started')
      throw new BadRequestError(`The game is not started yet`)
    if (player.symbol !== game.turn)
      throw new BadRequestError(`It's not your turn`)

    if (guess.guess.length > 1) {
      // CHECK FULL TITLE GUESSES
      const winner = isWinner(game.movie.title, guess.guess.split(''))

      if (winner) {
        const user = await User.findOne(player.user.id)

        if (!user) throw new NotFoundError(`User does not exist`)
        game.winner = player.symbol
        game.status = 'finished'
        user.points += game.score
        await user.save()

        io.emit('action', {
          type: 'UPDATE_USER',
          payload: user
        })
      } else {
        game.turn = player.symbol === 'x' ? 'o' : 'x'
      }

      game.score > 250 ? (game.score -= 250) : (game.score = 0)

      await game.save()

      const updatedGame = await Game.findOne(game.id)

      if (!updatedGame) throw new BadRequestError(`Game does not exist`)

      const displayTitle = showGuess(
        updatedGame.movie.title,
        updatedGame.guesses
      )

      const displayGame = { ...updatedGame, movie: displayTitle }

      io.emit('action', {
        type: 'UPDATE_GAME',
        payload: updatedGame.winner === null ? displayGame : updatedGame
      })

      return updatedGame.winner === null ? displayGame : updatedGame
    } else {
      // CHECK LETTER GUESSES

      const winner = isWinner(game.movie.title, [...game.guesses, guess.guess])

      if (winner) {
        const user = await User.findOne(player.user.id)

        if (!user) throw new NotFoundError(`User does not exist`)
        game.winner = player.symbol
        game.status = 'finished'
        user.points += game.score
        await user.save()

        io.emit('action', {
          type: 'UPDATE_USER',
          payload: user
        })
      } else {
        game.turn = player.symbol === 'x' ? 'o' : 'x'
      }

      game.keyboard[guess.guess] = 'true'
      game.guesses = [...game.guesses, guess.guess]

      if (wrongGuess(game.movie.title, guess.guess)) {
        game.score > 250 ? (game.score -= 250) : (game.score = 0)
      }

      await game.save()

      const updatedGame = await Game.findOne(game.id)

      if (!updatedGame) throw new BadRequestError(`Game does not exist`)

      const displayTitle = showGuess(
        updatedGame.movie.title,
        updatedGame.guesses
      )

      const displayGame = { ...updatedGame, movie: displayTitle }

      io.emit('action', {
        type: 'UPDATE_GAME',
        payload: updatedGame.winner === null ? displayGame : updatedGame
      })

      return updatedGame.winner === null ? displayGame : updatedGame
    }
  }
}

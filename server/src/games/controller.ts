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
import { Game, Player } from './entities'
import { io } from '../index'
import { showGuess, isWinner } from './logic'

@JsonController()
export default class GameController {
  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(@CurrentUser() user: User) {
    const entity = await Game.create().save()

    await Player.create({
      game: entity,
      user,
      symbol: 'x'
    }).save()

    const game = await Game.findOne(entity.id)

    if (!game) throw new BadRequestError(`Game does not exist`)

    const displayTitle = showGuess(game.movie.title, game.guesses)

    io.emit('action', {
      type: 'ADD_GAME',
      payload: {
        title: displayTitle,
        guesses: game.guesses
      }
    })

    const displayGame = { ...game, movie: displayTitle }
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
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch('/games/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() guess: string
  ) {
    const game = await Game.findOne(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started')
      throw new BadRequestError(`The game is not started yet`)
    if (player.symbol !== game.turn)
      throw new BadRequestError(`It's not your turn`)
    // if (!isValidTransition(player.symbol, game.board, update.board)) {
    //   throw new BadRequestError(`Invalid move`)
    // }

    const winner = isWinner(game.movie.title, [...game.guesses, guess])

    if (winner) {
      game.winner = player.symbol
      game.status = 'finished'
    }
    // else if (finished(update.board)) {
    //   game.status = 'finished'
    // }
    else {
      game.turn = player.symbol === 'x' ? 'o' : 'x'
    }
    game.guesses.push(guess)
    await game.save()

    const updatedGame = await Game.findOne(game.id)

    if (!updatedGame) throw new BadRequestError(`Game does not exist`)

    const displayTitle = showGuess(updatedGame.movie.title, updatedGame.guesses)

    const displayGame = { ...updatedGame, movie: displayTitle }

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: displayGame
    })

    return displayGame
  }
}

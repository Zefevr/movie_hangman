import {
  JsonController,
  Authorized,
  CurrentUser,
  Post,
  Param,
  BadRequestError,
  HttpCode,
  Get
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player } from './entities'
import { io } from '../index'
import { showGuess } from './logic'

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

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOne(game.id)
    })

    return player
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  getGame(@Param('id') id: number) {
    return Game.findOne(id)
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
}

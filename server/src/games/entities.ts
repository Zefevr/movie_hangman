import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToOne
} from 'typeorm'
import User from '../users/entity'

export interface Movie {
  title: string
  overview: string
  releaseDate: string
}

export type Symbol = 'x' | 'o'
export type Guesses = string[]

type Status = 'pending' | 'started' | 'finished'

const defaultMovie: Movie = {
  title: 'Titanic',
  overview: 'Leonardo DiCaprio dies',
  releaseDate: '1997'
}

const defaultGuesses = []

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number

  @Column('json', { default: defaultMovie })
  movie: Movie

  @Column('json', { default: defaultGuesses, nullable: true })
  guesses: Guesses

  @Column('char', { length: 1, default: 'x' })
  turn: Symbol

  @Column('char', { length: 1, nullable: true })
  winner: Symbol

  @Column('text', { default: 'pending' })
  status: Status

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[]
}

@Entity()
@Index(['game', 'user', 'symbol'], { unique: true })
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number

  @ManyToOne(_ => User, user => user.players, { eager: true })
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  // @Column() userId: number

  @Column('char', { length: 1 })
  symbol: Symbol
}

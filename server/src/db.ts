import { createConnection } from 'typeorm'
import { DefaultNamingStrategy } from 'typeorm/naming-strategy/DefaultNamingStrategy'
import { NamingStrategyInterface } from 'typeorm/naming-strategy/NamingStrategyInterface'
import { snakeCase } from 'typeorm/util/StringUtils'
import User from './users/entity'
import { Game, Player } from './games/entities'

class CustomNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName) + 's'
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[]
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join('_')
    )
  }

  columnNameCustomized(customName: string): string {
    return customName
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName)
  }
}

export default () =>
  createConnection({
    type: 'postgres',
    url:
      process.env.DATABASE_URL ||
      'postgres://wiiflojplwcncs:2241a9be749acc2838356c6eba5400fbb1c896ea05f95b0c9328f00e403c18a4@ec2-54-235-206-118.compute-1.amazonaws.com:5432/dbirq5r0nojr1o',
    entities: [User, Game, Player],
    synchronize: true, // careful with this in production!
    logging: true,
    namingStrategy: new CustomNamingStrategy()
  }).then(_ => console.log('Connected to Postgres with TypeORM'))

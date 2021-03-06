/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:27:52
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 12:15:23
 */

import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LogController } from './log.controller'
import { LogService } from './log.service'
import {
  LoginLogEntity,
  UpdateLogEntity,
  DeviceInfoLogEntity,
} from './entity/index'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoginLogEntity,
      UpdateLogEntity,
      DeviceInfoLogEntity,
    ]),
  ],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
// export class LogModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(SignMiddleware).forRoutes(LogController)
//   }
// }

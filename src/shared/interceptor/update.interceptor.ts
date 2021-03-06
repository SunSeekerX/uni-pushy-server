/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:57:32
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 15:58:48
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

import { UpdateAppDto } from 'src/dto'
import { LogService } from 'src/log/log.service'

import { CreateDeviceInfoLogDto, CreateUpdateLogDto } from 'src/log/dto'
import { ResponseRO } from '../interface/response.interface'

@Injectable()
export class UpdateInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest<Request>()

    return next.handle().pipe(
      tap(async (data: ResponseRO) => {
        const updateAppDto: UpdateAppDto = plainToClass(UpdateAppDto, req.body)
        const updateLogDto: CreateUpdateLogDto = plainToClass(
          CreateUpdateLogDto,
          Object.assign(updateAppDto, {
            uuid: updateAppDto.systemInfo.uuid,
            message: data.message,
            statusCode: data.statusCode,
          }),
        )

        const deviceInfoLogDto: CreateDeviceInfoLogDto = plainToClass(
          CreateDeviceInfoLogDto,
          updateAppDto.systemInfo,
        )
        const deviceInfo = await this.logService.querySingleDeviceInfo({
          uuid: updateAppDto.systemInfo.uuid,
        })
        if (!deviceInfo) {
          await this.logService.createDeviceInfoLog(deviceInfoLogDto)
        }
        await this.logService.createUpdateLog(updateLogDto)
      }),
    )
  }
}

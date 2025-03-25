import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  testApp(): string {
    //return process.env.TEST;
    return this.configService.getOrThrow('TEST');
  }
}

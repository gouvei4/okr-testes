import { Module } from '@nestjs/common';
import { UserService } from './task.service';

@Module({
  providers: [UserService]
})
export class UserModule {}

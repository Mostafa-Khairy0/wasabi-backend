// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersService } from './users.service';

@Global()
@Module({
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})
export class DatabaseModule {}

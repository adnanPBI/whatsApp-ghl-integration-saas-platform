import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GhlSubaccount } from './entities/ghl-subaccount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GhlSubaccount])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class GhlModule {}

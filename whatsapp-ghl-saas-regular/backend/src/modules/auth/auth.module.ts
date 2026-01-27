import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GhlSubaccount } from '../ghl/entities/ghl-subaccount.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GhlSubaccount, Tenant])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthModule {}

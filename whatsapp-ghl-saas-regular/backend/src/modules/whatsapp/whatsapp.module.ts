import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappAccount } from './entities/whatsapp-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsappAccount])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class WhatsappModule {}

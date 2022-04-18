import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashierController } from './cashier.controller';
import { CashierService } from './cashier.service';
import { Cashier } from './entities/cashier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cashier])],
  controllers: [CashierController],
  providers: [CashierService],
})
export class CashierModule {}

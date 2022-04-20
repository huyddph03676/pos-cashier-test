import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/payment/entities/payment.entity';
import { Product } from 'src/product/entities/product.entity';
import { RevenuesController, SoldsController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Product])],
  controllers: [RevenuesController, SoldsController],
  providers: [ReportService],
})
export class ReportModule {}

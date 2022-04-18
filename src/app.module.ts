import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CashierModule } from './cashier/cashier.module';
import { LoginModule } from './login/login.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { ReportModule } from './report/report.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    CashierModule,
    LoginModule,
    ProductModule,
    CategoryModule,
    PaymentModule,
    OrderModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

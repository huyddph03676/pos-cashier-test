import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { Order } from './entities/order.entity';
import { SubOrder } from './entities/sub-order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, SubOrder]),
    forwardRef(()=> ProductModule)
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

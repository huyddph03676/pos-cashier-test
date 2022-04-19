import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAll(query: FilterOrderDto) {
    const { limit = 10, skip = 0 } = query;

    const [orders, total] = await this.orderRepository.findAndCount({
      select: ['orderId', 'cashierId', 'paymentId', 'totalPrice', 'totalPaid', 'totalReturn', 'receiptId', 'createdAt'],
      take: limit,
      skip: skip,
    });

    const data = {
      orders,
      meta: {
        total,
        limit,
        skip,
      },
    };
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}

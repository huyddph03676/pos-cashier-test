import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { processResponse } from 'src/shared/common';
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

    const orderList: CreateOrderDto[] = await this.orderRepository.find({
      select: ['orderId', 'cashierId', 'paymentId', 'totalPrice', 'totalPaid', 'totalReturn', 'receiptId', 'created_at'],
      take: limit,
      skip: skip, 
    });

    const data = {
      orders: orderList,
      meta: {
        total: orderList.length,
        limit,
        skip,
      },
    };
    return processResponse(true, data);
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

}

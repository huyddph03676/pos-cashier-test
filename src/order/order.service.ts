import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SubTotalDto } from './dto/subtotal.dto';
import { Order } from './entities/order.entity';


type SubOrderTotalEntity = Product & {
  qty: number,
  totalNormalPrice: number,
  totalFinalPrice: number
}
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private productServices: ProductService,
  
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async createSubtotal(createSubOrderDto: SubTotalDto[]) {
    const listFinal : SubOrderTotalEntity[] = [];
    let subtotal = 0;

    for (const item of createSubOrderDto) {
      const productInfo = await this.productServices.getDetailById(item.productId)
      if (productInfo) {
        if (productInfo.stock < item.qty) {
          throw new NotFoundException('Stock not enough');
        }
        const itemSubtotal = productInfo.price * item.qty;
        // TODO: handle discount, default = 0
        const discountPrice = 0 ;

        const itemSubOrderTotalEntity: SubOrderTotalEntity = {
          ...productInfo,
          qty: item.qty,
          totalNormalPrice: itemSubtotal,
          totalFinalPrice: itemSubtotal - discountPrice
        };

        subtotal = subtotal + itemSubtotal - discountPrice;

        listFinal.push(itemSubOrderTotalEntity);
      }
    }

    return {
      subtotal,
      products: listFinal
    };
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

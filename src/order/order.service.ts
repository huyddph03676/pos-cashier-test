import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cashier } from 'src/cashier/entities/cashier.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { generateOrderId } from 'src/shared/common';
import { getConnection, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SubTotalDto } from './dto/subtotal.dto';
import { Order } from './entities/order.entity';
import { SubOrder } from './entities/sub-order.entity';

type SubOrderTotalEntity = Product & {
  qty: number;
  totalNormalPrice: number;
  totalFinalPrice: number;
};
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(SubOrder) private subOrderRepository: Repository<SubOrder>,
    private productServices: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto, cashier: Cashier) {
    const { paymentId, totalPaid, products: productList } = createOrderDto;
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subOrderCal = await this.createSubtotal(productList);
      const { subtotal: totalPrice, products } = subOrderCal;

      const orderDataInput = {
        cashierId: cashier.cashierId,
        paymentId,
        totalPrice,
        totalPaid,
        totalReturn: 0,
        receiptId: generateOrderId(6),
      };
      const orderDataCreate = this.orderRepository.create(orderDataInput);
      const orderDataSave = await queryRunner.manager.save(orderDataCreate);

      const productDataInput = [];
      for (const product of products) {
        const subOrderItem = this.subOrderRepository.create({
          orderId: orderDataSave.orderId,
          productId: product.productId,
          qty: product.qty,
        });
        productDataInput.push(subOrderItem);
      }

      await queryRunner.manager.save(productDataInput);
      await queryRunner.commitTransaction();

      return {
        orders: orderDataSave,
        products,
      };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        queryRunner.release();
    }

    return;
  }

  async createSubtotal(createSubOrderDto: SubTotalDto[]) {
    const listFinal: SubOrderTotalEntity[] = [];
    let subtotal = 0;

    for (const item of createSubOrderDto) {
      const productInfo = await this.productServices.getDetailById(item.productId);
      if (productInfo) {
        if (productInfo.stock < item.qty) {
          throw new NotFoundException('Stock not enough');
        }
        const itemSubtotal = productInfo.price * item.qty;
        // TODO: handle discount, default = 0
        const discountPrice = 0;

        const itemSubOrderTotalEntity: SubOrderTotalEntity = {
          ...productInfo,
          qty: item.qty,
          totalNormalPrice: itemSubtotal,
          totalFinalPrice: itemSubtotal - discountPrice,
        };

        subtotal = subtotal + itemSubtotal - discountPrice;

        listFinal.push(itemSubOrderTotalEntity);
      }
    }

    return {
      subtotal,
      products: listFinal,
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

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { CashierService } from 'src/cashier/cashier.service';
import { Cashier } from 'src/cashier/entities/cashier.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { generateOrderId, getPriceAfterDiscountByPercent } from 'src/shared/common';
import { DISCOUNT_TYPE } from 'src/shared/constants';
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
    private paymentServices: PaymentService,
    private cashierServices: CashierService,
  ) {}

  async create(createOrderDto: CreateOrderDto, cashier: Cashier) {
    const { paymentId, totalPaid, products: productList } = createOrderDto;
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const subOrderCal = await this.createSubtotal(productList);
      const { products } = subOrderCal;
      const totalPrice = _.sumBy(products, (p: SubOrderTotalEntity) => p.totalNormalPrice);
      const paymentRecord = await this.paymentServices.findOne(paymentId);
      const cashierRecord = await this.cashierServices.findOne(cashier.cashierId);
      const orderDataInput = {
        cashier: cashierRecord,
        payment: paymentRecord,
        totalPrice,
        totalPaid,
        totalReturn: totalPaid - totalPrice,
        receiptId: generateOrderId(6),
      };
      const orderDataCreate = this.orderRepository.create(orderDataInput);
      const orderDataSave = await queryRunner.manager.save(orderDataCreate);

      const productDataInput = [];
      // const productDataUpdate = [];
      for (const product of products) {
        const subOrderItem = this.subOrderRepository.create({
          order: orderDataSave,
          product: product,
          qty: product.qty,
          normalPrice: product.totalNormalPrice,
          finalPrice: product.totalFinalPrice,
        });
        productDataInput.push(subOrderItem);
        queryRunner.manager.decrement(Product, { productId: product.productId }, 'stock', product.qty);
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
  }

  async createSubtotal(createSubOrderDto: SubTotalDto[]) {
    const listFinal: SubOrderTotalEntity[] = [];
    let subtotal = 0;
    const ids = createSubOrderDto.map((item) => item.productId);
    const subOrderRawData = {};
    createSubOrderDto.forEach((item) => {
      subOrderRawData[item.productId] = item;
    });
    const products = await this.productServices.getDetailByIds(ids);
    if (products.length !== ids.length) {
      throw new BadRequestException('Some product not match');
    }

    products.forEach((product) => {
      delete product.category;

      const subOrder = subOrderRawData[product.productId];
      if (product.stock < subOrder.qty) {
        throw new BadRequestException(`${product.name} are not in stock`);
      }
      const totalNormalPrice = product.price * subOrder.qty;
      let priceAfterDiscount = 0;

      if (product.discount) {
        priceAfterDiscount = this.getPriceAfterDiscount(product, subOrder.qty);
      }

      const itemSubOrderTotalEntity: SubOrderTotalEntity = {
        ...product,
        qty: subOrder.qty,
        totalNormalPrice,
        totalFinalPrice: priceAfterDiscount,
      };

      subtotal += priceAfterDiscount;

      listFinal.push(itemSubOrderTotalEntity);
    });

    return {
      subtotal,
      products: listFinal,
    };
  }

  getPriceAfterDiscount(product: Product, qty: number) {
    const { discount } = product;
    let priceAfterDiscount = 0;
    if (qty < discount.qty) return 0;
    switch (discount.type) {
      case DISCOUNT_TYPE.BUY_N:
        priceAfterDiscount = this.getDiscountBuyN(product, qty);
        break;
      case DISCOUNT_TYPE.PERCENT:
        priceAfterDiscount = this.getDiscountByPercent(product, qty);
        break;
      default:
        priceAfterDiscount = 0;
        break;
    }
    return priceAfterDiscount;
  }

  getDiscountBuyN(product: Product, qty: number) {
    const { discount } = product;
    const qtyDiscount = discount.qty;
    const eachDiscount = Math.floor(qty / qtyDiscount);
    const numberItemDontDiscount = qty - eachDiscount * qtyDiscount;
    return eachDiscount * discount.result + numberItemDontDiscount * product.price;
  }

  getDiscountByPercent(product: Product, qty: number) {
    const { discount } = product;
    return qty * getPriceAfterDiscountByPercent(product.price, discount.result);
  }

  async findAll(query: FilterOrderDto) {
    const { limit = 10, skip = 0 } = query;

    const [orders, total] = await this.orderRepository.findAndCount({
      select: ['orderId', 'totalPrice', 'totalPaid', 'totalReturn', 'receiptId', 'createdAt'],
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

  async findOne(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['cashier', 'payment', 'suborders', 'suborders.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    const {suborders} = order;
    delete order.suborders;

    const finalProducts = suborders.map(suborder => {
      const {product} = suborder;
      delete suborder.product;
      return {
        ...suborder,
        ...product
      }
    })
    
    return {
      order,
      products: finalProducts
    };
  }
}

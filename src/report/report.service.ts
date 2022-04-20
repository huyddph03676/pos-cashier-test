import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Payment } from 'src/payment/entities/payment.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getRevenues() {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.orders', 'orders')
      .getMany();

    const paymentTypes = payments.map((payment) => {
      const totalAmountPerPayment = _.sumBy(payment.orders, (ord) => ord.totalPrice);
      return {
        paymentTypeId: payment.paymentId,
        name: payment.name,
        logo: payment.logo,
        totalAmount: totalAmountPerPayment,
      };
    });

    const totalRevenue = _.sumBy(paymentTypes, (p) => p.totalAmount);

    return {
      totalRevenue,
      paymentTypes,
    };
  }

  async getSolds() {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subOrder', 'subOrders')
      .getMany();

    const orderProducts = products.map((product) => {
      const totalQty = _.sumBy(product.subOrder.map((sub) => sub.qty));
      const totalAmount = product.price * totalQty;

      return {
        productId: product.productId,
        name: product.name,
        totalQty,
        totalAmount,
      };
    });

    return orderProducts;
  }
}

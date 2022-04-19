import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAYMENT_TYPE_ARRAY } from 'src/shared/constants';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto) {
    if (PAYMENT_TYPE_ARRAY.indexOf(createPaymentDto.type) === -1) {
      throw new NotFoundException('Type not match');
    }
    const createCategory = await this.paymentRepository.save(createPaymentDto);
    return createCategory;
  }

  async findAll(query: FilterPaymentDto) {
    const { limit = 10, skip = 0, subtotal } = query;

    if (subtotal) {
      // Do something
    }

    const [payments, total] = await this.paymentRepository.findAndCount({
      select: ['paymentId', 'name', 'type', 'logo'],
      take: limit,
      skip: skip,
      where: {
        isDeleted: false,
      },
    });

    const data = {
      payments,
      meta: {
        total,
        limit,
        skip,
      },
    };
    return data;
  }

  async findOne(paymentId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId, isDeleted: false },
      select: ['paymentId', 'name', 'type', 'logo'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return payment;
  }

  async update(paymentId: number, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(paymentId);
    await this.paymentRepository.update({ paymentId }, updatePaymentDto);
  }

  async remove(paymentId: number) {
    await this.findOne(paymentId);
    await this.paymentRepository.update({ paymentId }, { isDeleted: true });
  }
}

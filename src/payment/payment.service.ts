import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto) {
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
      where: { paymentId },
      select: ['paymentId', 'name', 'type', 'logo']
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
    await this.paymentRepository.delete({ paymentId });
  }
}

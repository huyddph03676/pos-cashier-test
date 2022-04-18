import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { processResponse } from 'src/shared/common';
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
    return processResponse(true, createCategory);
  }

  async findAll(query: FilterPaymentDto) {
    const { limit = 10, skip = 0, subtotal } = query;

    if (subtotal) {
      // Do something
    }

    const paymentList: CreatePaymentDto[] = await this.paymentRepository.find({
      select: ['paymentId', 'name', 'type', 'logo'],
      take: limit,
      skip: skip,
    });

    const data = {
      payments: paymentList,
      meta: {
        total: paymentList.length,
        limit,
        skip,
      },
    };
    return processResponse(true, data);
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { paymentId: id },
      select: ['paymentId', 'name', 'type', 'logo']
    });
    return processResponse(true, payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepository.update({ paymentId: id }, updatePaymentDto);
    return processResponse(true);
  }

  async remove(id: number) {
    await this.paymentRepository.delete({ paymentId: id });
    return processResponse(true);
  }
}

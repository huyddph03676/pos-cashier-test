import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { processResponse } from 'src/shared/common';
import { Repository } from 'typeorm';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { FilterCashierDto } from './dto/filter-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { Cashier } from './entities/cashier.entity';

@Injectable()
export class CashierService {
  constructor(@InjectRepository(Cashier) private cashierRepository: Repository<Cashier>) {}

  async create(createCashierDto: CreateCashierDto) {
    const createCategory = await this.cashierRepository.save(createCashierDto);
    return processResponse(true, createCategory);
  }

  async findAll(query: FilterCashierDto) {
    const { limit = 10, skip = 0 } = query;

    const cashierList: CreateCashierDto[] = await this.cashierRepository.find({
      select: ['cashierId', 'name'],
      take: limit,
      skip: skip,
    });

    const data = {
      cashiers: cashierList,
      meta: {
        total: cashierList.length,
        limit,
        skip,
      },
    };
    return processResponse(true, data);
  }

  async findOne(id: number) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId: id },
      select: ['cashierId', 'name']
    });
    return processResponse(true, cashier);
  }

  async update(id: number, updateCashierDto: UpdateCashierDto) {
    await this.cashierRepository.update({ cashierId: id }, updateCashierDto);
    return processResponse(true);
  }

  async remove(id: number) {
    await this.cashierRepository.delete({ cashierId: id });
    return processResponse(true);
  }
}

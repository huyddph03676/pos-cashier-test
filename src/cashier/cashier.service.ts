import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import PayloadToken from 'src/auth/interface/payloadToken.interface';
import { Repository } from 'typeorm';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { FilterCashierDto } from './dto/filter-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { Cashier } from './entities/cashier.entity';

@Injectable()
export class CashierService {
  constructor(
    @InjectRepository(Cashier) private cashierRepository: Repository<Cashier>,
    private jwtService: JwtService,
  ) {}

  async create(createCashierDto: CreateCashierDto) {
    const createCategory = await this.cashierRepository.save(createCashierDto);
    return createCategory;
  }

  getToken(cashier: Cashier) {
    const payload: PayloadToken = { passcode: cashier.passcode, CashierId: cashier.cashierId };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validate(cashierId, passcode) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId, passcode },
      select: ['passcode', 'cashierId', 'name'],
    });
    return cashier;
  }

  async findAll(query: FilterCashierDto) {
    const { limit = 10, skip = 0 } = query;

    const [cashiers, total] = await this.cashierRepository.findAndCount({
      select: ['cashierId', 'name'],
      take: limit,
      skip: skip,
    });

    const data = {
      cashiers,
      meta: {
        total,
        limit,
        skip,
      },
    };
    return data;
  }

  async findOne(cashierId: number) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId },
      select: ['cashierId', 'name'],
    });

    if (!cashier) throw new NotFoundException('Cashier not found');

    return cashier;
  }

  async findPasscodeById(cashierId: number) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId },
      select: ['passcode'],
    });

    if (!cashier) throw new NotFoundException('Cashier not found');

    return { passcode: cashier.passcode };
  }

  async update(cashierId: number, updateCashierDto: UpdateCashierDto) {
    await this.findOne(cashierId);

    await this.cashierRepository.update({ cashierId }, updateCashierDto);
  }

  async remove(cashierId: number) {
    await this.findOne(cashierId);

    await this.cashierRepository.delete({ cashierId });
  }
}

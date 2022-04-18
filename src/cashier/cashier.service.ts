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
      select: ['passcode', 'cashierId', 'passcode'],
    });
    return cashier;
  }

  async findAll(query: FilterCashierDto) {
    const { limit = 10, skip = 0 } = query;

    const [cashierList, total] = await this.cashierRepository.findAndCount({
      select: ['cashierId', 'name'],
      take: limit,
      skip: skip,
    });

    const data = {
      cashiers: cashierList,
      meta: {
        total,
        limit,
        skip,
      },
    };
    return data;
  }

  async findOne(id: number) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId: id },
      select: ['cashierId', 'name'],
    });

    if (!cashier) throw new NotFoundException('Cashier not found');

    return cashier;
  }

  async findPasscodeById(id: number) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId: id },
      select: ['passcode'],
    });

    if (!cashier) throw new NotFoundException('Cashier not found');

    return { passcode: cashier.passcode };
  }

  async update(id: number, updateCashierDto: UpdateCashierDto) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId: id },
      select: ['cashierId', 'name'],
    });

    if (!cashier) throw new NotFoundException('Cashier not found');
    await this.cashierRepository.update({ cashierId: id }, updateCashierDto);
  }

  async remove(id: number) {
    const cashier = await this.cashierRepository.findOne({
      where: { cashierId: id },
      select: ['cashierId', 'name'],
    });

    if (!cashier) throw new NotFoundException('Cashier not found');

    await this.cashierRepository.delete({ cashierId: id });
  }
}

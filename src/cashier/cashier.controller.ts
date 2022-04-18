import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { CashierService } from './cashier.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { FilterCashierDto } from './dto/filter-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';

@ApiTags('Cashiers')
@Controller('cashiers')
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  @Post()
  create(@Body() createCashierDto: CreateCashierDto) {
    return this.cashierService.create(createCashierDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post(':cashierId/login')
  async login(@Req() request: RequestWithUser) {
    const token = this.cashierService.getToken(request.user);
    return { token };
  }

  @Get()
  findAll(@Query() query: FilterCashierDto) {
    return this.cashierService.findAll(query);
  }

  @Get(':cashierId')
  findOne(@Param('cashierId', ParseIntPipe) cashierId: number) {
    return this.cashierService.findOne(cashierId);
  }

  @Get(':cashierId/passcode')
  findPasscode(@Param('cashierId', ParseIntPipe) cashierId: number) {
    return this.cashierService.findPasscodeById(cashierId);
  }

  @Put(':cashierId')
  update(@Param('cashierId', ParseIntPipe) cashierId: number, @Body() updateCashierDto: UpdateCashierDto) {
    return this.cashierService.update(cashierId, updateCashierDto);
  }

  @Delete(':cashierId')
  remove(@Param('cashierId', ParseIntPipe) cashierId: number) {
    return this.cashierService.remove(cashierId);
  }
}

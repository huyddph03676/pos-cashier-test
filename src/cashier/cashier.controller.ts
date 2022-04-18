import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Get()
  findAll(@Query() query: FilterCashierDto) {
    return this.cashierService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashierService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCashierDto: UpdateCashierDto) {
    return this.cashierService.update(+id, updateCashierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashierService.remove(+id);
  }
}

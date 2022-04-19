import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: FilterPaymentDto) {
    return this.paymentService.findAll(query);
  }

  @Get(':paymentId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentService.findOne(paymentId);
  }

  @Put(':paymentId')
  update(@Param('paymentId', ParseIntPipe) paymentId: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(paymentId, updatePaymentDto);
  }

  @Delete(':paymentId')
  remove(@Param('paymentId') id: string) {
    return this.paymentService.remove(+id);
  }
}

import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SubTotalDto } from './dto/subtotal.dto';
import { OrderService } from './order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const { user: cashier } = req;
    return this.orderService.create(createOrderDto, cashier);
  }

  @Post('subtotal')
  createSubtotal(@Body() createSubOrderDto: SubTotalDto[]) {
    return this.orderService.createSubtotal(createSubOrderDto);
  }

  @Get()
  findAll(@Query() query: FilterOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get(':orderId')
  findOne(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.findOne(orderId);
  }
}

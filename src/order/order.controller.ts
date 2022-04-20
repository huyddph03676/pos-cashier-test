import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { SubTotalDto } from './dto/subtotal.dto';
import { OrderService } from './order.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html_to_pdf = require('html-pdf-node');

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
  @UseGuards(JwtAuthGuard)
  createSubtotal(@Body() createSubOrderDto: SubTotalDto[]) {
    return this.orderService.createSubtotal(createSubOrderDto);
  }

  @Get()
  findAll(@Query() query: FilterOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get(':orderId/download')
  @UseGuards(JwtAuthGuard)
  async download(@Res() response: any, @Param('orderId', ParseIntPipe) orderId: number) {
    const options = { format: 'A4' };

    const { fileName, fileContent } = await this.orderService.download(orderId);
    const file = { content: fileContent };
    const filePdf = await html_to_pdf.generatePdf(file, options);

    response.set('Content-disposition', 'attachment; filename=' + fileName);
    response.end(new Buffer(filePdf, 'base64'));
  }

  @Get(':orderId/check-download')
  @UseGuards(JwtAuthGuard)
  async checkdownload(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.checkDownload(orderId);
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.findOne(orderId);
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: FilterProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.findOne(+productId);
  }

  @Put(':productId')
  update(@Param('productId', ParseIntPipe) productId: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+productId, updateProductDto);
  }

  @Delete(':productId')
  remove(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.remove(+productId);
  }
}

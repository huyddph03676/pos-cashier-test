import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: FilterCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':categoryId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoryService.findOne(categoryId);
  }

  @Put(':categoryId')
  update(@Param('categoryId', ParseIntPipe) categoryId: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }

  @Delete(':categoryId')
  remove(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoryService.remove(+categoryId);
  }
}

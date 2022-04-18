import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { processResponse } from 'src/shared/common';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const createCategory = await this.categoryRepository.save(createCategoryDto);
    return processResponse(true, createCategory);
  }

  async findAll(query: FilterCategoryDto) {
    const { limit = 10, skip = 0 } = query;

    const [categoryList, total] = await this.categoryRepository.findAndCount({
      select: ['categoryId', 'name'],
      take: limit,
      skip: skip,
    });

    const data = {
      categories: categoryList,
      meta: {
        total: total,
        limit,
        skip,
      },
    };
    return data;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
      select: ['categoryId', 'name'],
    });
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update({ categoryId: id }, updateCategoryDto);
  }

  async remove(id: number) {
    await this.categoryRepository.delete({ categoryId: id });
  }
}

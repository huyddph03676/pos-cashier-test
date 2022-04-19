import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    return createCategory;
  }

  async findAll(query: FilterCategoryDto) {
    const { limit = 10, skip = 0 } = query;

    const [categories, total] = await this.categoryRepository.findAndCount({
      select: ['categoryId', 'name'],
      take: limit,
      skip: skip,
    });

    const data = {
      categories,
      meta: {
        total,
        limit,
        skip,
      },
    };
    return data;
  }

  async findOne(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
      select: ['categoryId', 'name'],
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(categoryId);
    await this.categoryRepository.update({ categoryId }, updateCategoryDto);
  }

  async remove(categoryId: number) {
    await this.findOne(categoryId);
    await this.categoryRepository.delete({ categoryId });
  }
}

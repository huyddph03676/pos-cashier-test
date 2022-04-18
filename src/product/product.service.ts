import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { processResponse } from 'src/shared/common';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {}

  async create(createProductDto: CreateProductDto) {
    const createProduct = await this.productRepository.save(createProductDto);
    return processResponse(true, createProduct);
  }

  async findAll(query: FilterProductDto) {
    const { limit = 10, skip = 0, categoryId, q } = query;
    const queryFilter = {};

    if (q) {
      queryFilter['name'] = q;
    }
    if (categoryId) {
      queryFilter['categoryId'] = categoryId;
    }

    const productList: CreateProductDto[] = await this.productRepository.find({
      select: ['productId', 'sku', 'name', 'stock', 'price', 'image', 'categoryId', 'discount'],
      where: queryFilter,
      take: limit,
      skip: skip,
      relations: ['categoryId'],
    });

    const data = {
      products: productList,
      meta: {
        total: productList.length,
        limit,
        skip,
      },
    }
    return processResponse(true, data);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { productId: id },
    });
    return processResponse(true, product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productRepository.update({ productId: id }, updateProductDto);
    return processResponse(true);
  }

  async remove(id: number) {
    await this.productRepository.delete({ productId: id });
    return processResponse(true);
  }
}

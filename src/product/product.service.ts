import { Injectable, NotFoundException } from '@nestjs/common';
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
    // if (categoryId) {
    //   queryFilter['categoryId'] = categoryId;
    // }

    const [products, total] = await this.productRepository.findAndCount({
      select: ['productId', 'sku', 'name', 'stock', 'price', 'image', 'discount'],
      where: queryFilter,
      take: limit,
      skip: skip,
      relations: ['category'],
    });

    const data = {
      products,
      meta: {
        total,
        limit,
        skip,
      },
    }
    return processResponse(true, data);
  }

  async findOne(productId: number) {
    // const product = await this.productRepository.findOne({
    //   where: { productId },
    //   relations: ['category'],
    // });
    const product = this.productRepository.createQueryBuilder('product')
      .where({ productId })
      .leftJoinAndSelect('product.category', 'category')
      .select(['product.productId', 'product.sku', 'product.name', 'product.stock', 'product.image', 'product.discount', 'category'])
      .getOne()
      // .leftJoinAndMapOne('product.categoryId', Category, 'category', 'product.categoryId = category.categoryId')
      // .leftJoin(Category, 'category', 'product.categoryId = category.categoryId')
      // .addSelect("category.name AS categoryName" )

    // console.log("productQuery.", productQuery.getQueryAndParameters())
      // const product = await productQuery.getOne()
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    await this.findOne(productId);
    await this.productRepository.update({ productId }, updateProductDto);
  }

  async remove(productId: number) {
    await this.findOne(productId);
    await this.productRepository.delete({ productId });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
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
    return createProduct;
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

    // const productsQuery = this.productRepository
    // .createQueryBuilder('product')
    // .where(queryFilter)
    // .select(['product.productId', 'product.sku', 'product.name', 'product.stock', 'product.image', 'product.discount', 'product.category'])
    // .leftJoinAndMapOne('product.category', Category, 'category', 'product.categoryId = category.categoryId')
    // .limit(limit)
    // .skip(skip);

    const [products, total] = await this.productRepository.findAndCount({
      where: queryFilter,
      relations: ['category'],
      select: ['productId', 'sku', 'name', 'stock', 'image'],
    });

    const data = {
      products,
      meta: {
        total,
        limit,
        skip,
      },
    };
    return data;
  }

  async findOne(productId: number) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where({ productId })
      .select([
        'product.productId',
        'product.sku',
        'product.name',
        'product.stock',
        'product.image',
        'product.discount',
        'product.category',
      ])
      .leftJoinAndMapOne('product.category', Category, 'category', 'product.categoryId = category.categoryId')
      .getOne();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getDetailById(productId: number) {
   const product =await this.productRepository.findOne({
     where: {
       productId
     }
   })
   if (!product) throw new NotFoundException('Product not found');

   return product
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { DiscountService } from 'src/discount/discount.service';
import { generatorSku } from 'src/shared/common';
import { FindConditions, Like, ObjectLiteral, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private discountService: DiscountService,
    private categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let discount = null;

    if (createProductDto.discount) {
      discount = await this.discountService.createWithProduct(createProductDto);
    }

    const category = await this.categoryService.findOne(createProductDto.categoryId);
    const productTem = this.productRepository.create(createProductDto);

    productTem.discount = discount;
    productTem.category = category;
    productTem.isDeleted = false;

    const createProduct = await this.productRepository.save(productTem);

    if (createProduct) {
      const sku = generatorSku('ID', createProduct.productId, 3);
      await this.productRepository.update(createProduct.productId, {
        sku,
      });
      createProduct.sku = sku;
    }

    delete createProduct.category;
    delete createProduct.discount;
    delete createProduct.isDeleted;

    return createProduct;
  }

  async findAll(query: FilterProductDto) {
    const { limit = 10, skip = 0, categoryId, q } = query;
    const queryFilter: FindConditions<Product>[] | FindConditions<Product> | ObjectLiteral | string = {};
    queryFilter.category = {
      isDeleted: false,
    };
    if (q) {
      queryFilter.name = Like(`%${q.trim()}%`);
    }
    if (categoryId) {
      queryFilter.category = {
        ...queryFilter.category,
        categoryId,
      };
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: queryFilter,
      relations: ['category', 'discount'],
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
    const product = await this.productRepository.findOne({
      where: {
        productId,
        isDeleted: false,
        category: {
          isDeleted: false,
        },
      },
      relations: ['category', 'discount'],
      select: ['productId', 'sku', 'name', 'stock', 'image'],
    });
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getDetailById(productId: number) {
    const product = await this.productRepository.findOne({
      where: {
        productId,
        isDeleted: false,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getDetailByIds(productIds: number[]) {
    const product = await this.productRepository.findByIds(productIds, {
      where: {
        isDeleted: false,
        category: {
          isDeleted: false,
        },
      },
      relations: ['discount', 'category'],
    });

    return product;
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    const oldProduct = await this.findOne(productId);

    const category = await this.categoryService.findOne(updateProductDto.categoryId);
    const product = this.productRepository.create(updateProductDto);

    product.category = category;

    await this.productRepository.update({ productId }, product);
    await this.discountService.updateDiscountByProduct(
      oldProduct.discount ? oldProduct.discount.discountId : null,
      updateProductDto,
    );
  }

  async remove(productId: number) {
    await this.findOne(productId);
    await this.productRepository.update({ productId }, { isDeleted: false });
  }
}

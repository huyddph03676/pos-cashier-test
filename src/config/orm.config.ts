import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cashier } from 'src/cashier/entities/cashier.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { SubOrder } from 'src/order/entities/sub-order.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Product } from 'src/product/entities/product.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Cashier, Category, Payment, Product, Order, SubOrder],
    synchronize: Boolean(process.env.SYNCHRONIZE),
  }),
);

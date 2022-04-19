import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class SubOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.suborderIds)
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Product, (product) => product.subOrder)
  product: Product;

  @Column()
  productId: number;

  qty: number;
}

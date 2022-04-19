import { Category } from 'src/category/entities/category.entity';
import { SubOrder } from 'src/order/entities/sub-order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  discount: number;

  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.productIds)
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => SubOrder, (suborder) => suborder.product)
  suborderIds: SubOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

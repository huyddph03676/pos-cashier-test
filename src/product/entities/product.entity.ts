import { Category } from 'src/category/entities/category.entity';
import { Discount } from 'src/discount/entities/discount.entity';
import { SubOrder } from 'src/order/entities/sub-order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ nullable: true })
  sku: string;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => SubOrder, (suborder) => suborder.product)
  subOrder: SubOrder[];

  @OneToOne(() => Discount)
  @JoinColumn({ name: 'discountId' })
  discount: Discount;

  @Column({ default: false, name: 'isDeleted' })
  @Column({ select: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Category, (category) => category.productIds)
  category: Category;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

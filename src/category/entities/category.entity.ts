import { Product } from 'src/product/entities/product.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  productIds: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

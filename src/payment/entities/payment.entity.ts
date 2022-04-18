import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => Order, (order) => order.payment)
  orderIds: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

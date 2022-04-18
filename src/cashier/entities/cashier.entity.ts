import { Order } from 'src/order/entities/order.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Cashier {
  @PrimaryGeneratedColumn()
  cashierId: number;

  @Column()
  name: string;

  @Column()
  passcode: string;

  @OneToMany(() => Order, (order) => order.cashier)
  orderIds: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

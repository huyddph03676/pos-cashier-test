import { Cashier } from 'src/cashier/entities/cashier.entity';

export default interface RequestWithUser extends Request {
  user: Cashier;
}

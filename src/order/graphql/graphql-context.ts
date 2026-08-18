import DataLoader from 'dataloader';
import { Order } from './order.type';

export interface GraphQLContext {
  orderLoader: DataLoader<string, Order[]>;
}

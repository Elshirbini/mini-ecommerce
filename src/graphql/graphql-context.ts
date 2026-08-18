import DataLoader from 'dataloader';
import { Order } from '../order/graphql/order.type';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface GraphQLContext {
  orderLoader: DataLoader<string, Order[]>;
  reply: FastifyReply;
  request: FastifyRequest;
}

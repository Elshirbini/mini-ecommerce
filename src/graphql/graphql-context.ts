import DataLoader from 'dataloader';
import { Order } from '../order/graphql/order.type';
import { FastifyReply, FastifyRequest } from 'fastify';
import { jwtPayload } from 'src/common/interfaces/jwt-payload.interface';

export interface GraphQLContext {
  orderLoader: DataLoader<string, Order[]>;
  reply: FastifyReply;
  request: FastifyRequest;
  user?: jwtPayload;
}

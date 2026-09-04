import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { WsAuthGuard } from 'src/common/guards/ws-auth.guard';
import { NotificationService } from './notification.service';
import { QueryInput } from './graphql/query.input';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { NotificationResponse } from './graphql/notification-response.type';
import { Notification } from './graphql/notification.type';
import { pubSub } from './pubsub';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Query(() => NotificationResponse)
  getNotifications(
    @Context() ctx: GraphQLContext,
    @Args('input') query: QueryInput,
  ) {
    return this.notificationService.getNotifications(ctx, query);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  markAsRead(@Context() ctx: GraphQLContext, @Args('id') id: string) {
    return this.notificationService.markAsRead(ctx, id);
  }

  @UseGuards(WsAuthGuard)
  @Subscription(() => Notification, {
    name: 'notificationCreated',
  })
  notificationCreated(@Context() context: GraphQLContext) {
    console.log('SUBSCRIPTION CONTEXT:', context);
    return pubSub.asyncIterableIterator('NOTIFICATION_CREATED');
  }
}

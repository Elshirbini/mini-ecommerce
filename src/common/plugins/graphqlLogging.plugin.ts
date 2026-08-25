import type { ApolloServerPlugin } from '@apollo/server';
import { Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

interface GraphQLContext {
  request: FastifyRequest;
  reply: FastifyReply;
}

export const GraphQLLoggingPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    const logger = new Logger('GraphQLLoggingPlugin');
    const start = Date.now();

    return {
      async willSendResponse({
        request: apolloRequest,
        response,
        contextValue,
      }) {
        const { request: httpRequest, reply } = contextValue;

        logger.log({
          type: 'graphql_request',

          method: httpRequest.method,

          url: httpRequest.url,

          statusCode: reply.statusCode,

          durationMs: Date.now() - start,

          ip: httpRequest.ip ?? httpRequest.headers['x-forwarded-for'] ?? null,

          userAgent: httpRequest.headers['user-agent'] ?? null,

          requestId:
            httpRequest.id ?? httpRequest.headers['x-request-id'] ?? null,

          userId: httpRequest.userId ?? null,

          operationName: apolloRequest.operationName ?? 'anonymous',

          errors:
            response.body.kind === 'single'
              ? (response.body.singleResult.errors?.map(
                  (error) => error.message,
                ) ?? [])
              : [],
        });
      },
    };
  },
};

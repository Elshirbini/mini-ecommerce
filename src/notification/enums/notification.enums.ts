export enum NotificationType {
  COMMENT = 'comment',
  MESSAGE = 'message',
  LIKE = 'like',
  LIVE_SESSION = 'live-session',
  CONTENT = 'content',
  PAYOUT = 'payout',
}

export enum NotificationChannel {
  DATABASE = 'database',
  SOCKET = 'socket',
  FCM = 'fcm',
  WHATSAPP = 'whatsapp',
  /** Publishes to the in-process GraphQL PubSub bus (WebSocket subscriptions) */
  GRAPHQL_PUBSUB = 'graphql_pubsub',
}

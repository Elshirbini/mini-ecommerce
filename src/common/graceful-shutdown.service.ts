import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class GracefulShutdownService implements OnModuleDestroy {
  private readonly logger = new Logger(GracefulShutdownService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleDestroy() {
    this.logger.log('Closing MongoDB connection...');
    try {
      await this.connection.close();
      this.logger.log('MongoDB connection closed successfully');
    } catch (error) {
      this.logger.error('Error closing MongoDB connection:', error);
    }
  }
}

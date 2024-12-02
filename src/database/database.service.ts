import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    this.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    this.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.connection.on('disconnected', async () => {
      console.log('MongoDB disconnected');
      await app.close();
    });
  }
}

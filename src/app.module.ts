import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GeocodeAddressModule } from '@modules/Integrations/GeocodeAddress/GeocodeAddress.module';
import { RegionsModule } from '@modules/regions/regions.module';
import { GeoModule } from '@modules/geo/geo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UsersModule,
    RegionsModule,
    AuthModule,
    GeocodeAddressModule,
    GeoModule,
  ], // Configuração do MongoDB],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Region, RegionModel } from '@modules/regions/model/Region';
import { UsersModule } from '@modules/users/users.module';
import { GeoModule } from '@modules/geo/geo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Region.name, schema: RegionModel.schema },
    ]),
    UsersModule,
    GeoModule,
  ],
  controllers: [RegionsController],
  providers: [RegionsService],
  exports: [RegionsService],
})
export class RegionsModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserModel } from '@modules/users/model/User';
import { MongooseModule } from '@nestjs/mongoose';
import { GeocodeAddressModule } from '@modules/Integrations/GeocodeAddress/GeocodeAddress.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserModel.schema }]),
    GeocodeAddressModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPagination } from 'src/types/global';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserResponse } from '@modules/users/response/user.response';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@modules/users/model/User';
import { Model } from 'mongoose';
import { encrypt } from '@utils/encrypt';
import { UserListResponse } from '@modules/users/response/userList.response';
import { GeocodeAddressService } from '@modules/Integrations/GeocodeAddress/GeocodeAddress.service';
import { ValidateAddressCordenatesHelper } from '@modules/users/helpers/ValidateAddressCordenates.helper';
import { GetAddresssOrCordenatesHelper } from '@modules/users/helpers/GetAddresssOrCordenates.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly geocodeAddressService: GeocodeAddressService,
  ) {}

  async createUser(data: CreateUserDto) {
    ValidateAddressCordenatesHelper.validarCordenadasAddress(data);

    const user = await this.userModel.findOne({ email: data.email }).exec();
    if (user) {
      throw new HttpException(
        `User which email '${data.email}' was exist`,
        HttpStatus.FORBIDDEN,
      );
    }

    data = <CreateUserDto>(
      await GetAddresssOrCordenatesHelper.getAddresssOrCordenates(
        data,
        this.geocodeAddressService,
      )
    );

    const newUser = new this.userModel(data);
    newUser.password = encrypt(newUser.password);
    await newUser.save();

    return UserResponse.fromUserEntity(newUser);
  }

  async getUsers(pagination: IPagination) {
    const filter = {};

    const itemsPromise = this.userModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .exec();

    const totalPromise = this.userModel.countDocuments(filter).exec();

    const [items, total] = await Promise.all([itemsPromise, totalPromise]);

    const itemsResponse = UserListResponse.fromUserListEntityList(items);

    return {
      items: itemsResponse,
      count: itemsResponse.length,
      totalPages: Math.ceil(total / pagination.pageSize),
      total,
    };
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new HttpException(
        `User with id '${id}' was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return UserResponse.fromUserEntity(user);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    ValidateAddressCordenatesHelper.validarCordenadasAddress(data);

    const oldUser = await this.getUser(id);

    data = <UpdateUserDto>(
      await GetAddresssOrCordenatesHelper.getAddresssOrCordenates(
        data,
        this.geocodeAddressService,
      )
    );

    const updateData: Partial<UpdateUserDto> = {
      name: data.name || oldUser.name,
      password: data.password || oldUser.password,
    };

    if (data.password) {
      updateData.password = encrypt(data.password);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException(
        `User with id '${id}' was not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedUser;
  }

  async removeUser(id: string) {
    const user = await this.getUser(id);

    if (!user) {
      throw new HttpException(
        `User which '${id}' was not  exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.userModel.findByIdAndDelete(id).exec();

    return `User with id '${id}' has been removed successfully.`;
  }

  async getByEmail(email: string): Promise<UserResponse> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      return;
    }
    return {
      email: user.email,
      password: user.password,
    };
  }
}

import { getModelForClass, Prop, Ref } from '@typegoose/typegoose';
import { Base } from '../../../commons/models/Base';
import { Region } from '@modules/regions/model/Region';

export class User extends Base {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];
}

export const UserModel = getModelForClass(User);

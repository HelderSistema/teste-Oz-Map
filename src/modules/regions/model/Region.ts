import {
  getModelForClass,
  modelOptions,
  Prop,
  Ref,
} from '@typegoose/typegoose';
import { Base } from '../../../commons/models/Base';
import { RegionCoordinateDto } from '@modules/regions/dto/region.coordinate.dto';
import { User } from '@modules/users/model/User';

@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends Base {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
  })
  coordinates: RegionCoordinateDto[][];

  @Prop({
    required: true,
  })
  userId: number;

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}

export const RegionModel = getModelForClass(Region);

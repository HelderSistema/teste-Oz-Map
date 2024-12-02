import { Module } from '@nestjs/common';
import { GeocodeAddressService } from './GeocodeAddress.service';

@Module({
  providers: [GeocodeAddressService],
  exports: [GeocodeAddressService],
})
export class GeocodeAddressModule {}

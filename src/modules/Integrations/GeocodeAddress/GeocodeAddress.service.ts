import { Injectable } from '@nestjs/common';
import * as NodeGeocoder from 'node-geocoder';

@Injectable()
export class GeocodeAddressService {
  private geocoder: NodeGeocoder.Geocoder;

  constructor() {
    this.geocoder = NodeGeocoder({
      provider: 'google', // Escolha o provedor, ex: 'openstreetmap', 'mapbox', etc.
      apiKey: 'AIzaSyBElbvpzRiZa0zElhq2dczxkdLcnRUt5Ec', // Substitua com sua chave de API
    });
  }

  // Geocodificar (Endereço -> Coordenadas)
  async getCoordinates(
    address: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const results = await this.geocoder.geocode(address);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        return { latitude, longitude };
      }
      throw new Error('Endereço não encontrado');
    } catch (error) {
      throw new Error(`Erro ao geocodificar: ${error.message}`);
    }
  }

  // Geocodificação Reversa (Coordenadas -> Endereço)
  async getAddress(latitude: number, longitude: number): Promise<string> {
    try {
      const results = await this.geocoder.reverse({
        lat: latitude,
        lon: longitude,
      });
      if (results.length > 0) {
        return results[0].formattedAddress;
      }
      throw new Error(
        'Nenhum endereço encontrado para as coordenadas fornecidas',
      );
    } catch (error) {
      throw new Error(
        `Erro ao realizar geocodificação reversa: ${error.message}`,
      );
    }
  }
}

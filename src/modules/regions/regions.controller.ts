import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto, UpdateRegionDto } from './dto';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegionResponse } from '@modules/regions/response/region.response';
import { RegionListResponse } from '@modules/regions/response/regionList.response';
import { GetRegionsPointDto } from '@modules/regions/dto/get-regions-point.dto';
import { GetRegionsPointDistanceDto } from '@modules/regions/dto/get-regions-point-distance.dto';
import { ApiResponseRegionPointDto } from '@modules/regions/dto/get-regions-point-distance-response.dto';

@Controller('region')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: 'Criar uma região',
  })
  @ApiResponse({
    status: 200,
    type: RegionResponse,
  })
  createRegion(@Body(new ValidationPipe()) createRegionDto: CreateRegionDto) {
    return this.regionsService.createRegion(createRegionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('list')
  @ApiOperation({
    summary: 'Retorna uma lista de regiões com paginação',
  })
  @ApiResponse({
    status: 200,
    type: [RegionListResponse],
  })
  async getRegions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
  ) {
    return this.regionsService.getRegions({ page, pageSize });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({
    summary: 'Update de região por id',
  })
  @ApiResponse({
    status: 200,
    type: RegionResponse,
  })
  updateRegion(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateRegionDto: UpdateRegionDto,
  ) {
    return this.regionsService.updateRegion(id, updateRegionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta região pelo id',
  })
  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  async removeRegion(@Param('id') id: string) {
    return this.regionsService.removeRegion(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('point')
  @ApiOperation({
    summary: 'Retorna uma lista de regiões pertencente a região',
    description: `
    Exemplo de uso:
    point: -46.955045272818694,-22.429182742532248
  `,
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseRegionPointDto,
  })
  async getRegionsPoint(
    @Query(new ValidationPipe()) getRegionsPointDto: GetRegionsPointDto,
  ) {
    return this.regionsService.getRegionsPoint(getRegionsPointDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('point/distance')
  @ApiOperation({
    summary: 'Retorna uma lista de regiões até x metros de distancia',
    description: `
    Exemplo de uso:
    point: -46.955045272818694,-22.429182742532248
    limit: 1000 | Unidade em metros.
  `,
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseRegionPointDto,
  })
  async getRegionsPointDistance(
    @Query(new ValidationPipe())
    getRegionsPointDistanceDto: GetRegionsPointDistanceDto,
  ) {
    return this.regionsService.getRegionsPointDistance(
      getRegionsPointDistanceDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna uma região pelo id',
  })
  @ApiResponse({
    status: 200,
    type: RegionResponse,
  })
  async getRegion(@Param('id') id: string) {
    return this.regionsService.getRegion(id);
  }
}

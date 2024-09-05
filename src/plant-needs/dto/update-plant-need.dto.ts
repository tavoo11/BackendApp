import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantNeedsDto} from './create-plant-need.dto';

export class UpdatePlantNeedDto extends PartialType(CreatePlantNeedsDto) {}

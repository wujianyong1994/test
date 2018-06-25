import { Module } from '@nestjs/common';
import { ModelService } from './index';

@Module({
    components: [ModelService],
    exports: [ModelService]
})
export class ModelModule { }
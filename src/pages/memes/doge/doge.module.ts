import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DogePage } from './doge';
@NgModule({
  declarations: [
    DogePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(DogePage)
  ],
})
export class DogePageModule {}

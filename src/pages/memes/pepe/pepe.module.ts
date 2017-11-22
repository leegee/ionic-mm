import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PepePage } from './pepe';
@NgModule({
  declarations: [
    PepePage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PepePage)
  ],
})
export class PepeModule {}

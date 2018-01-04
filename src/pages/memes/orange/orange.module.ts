import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrangePage } from './orange';
@NgModule({
  declarations: [
    OrangePage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(OrangePage)
  ],
})
export class OrangeModule {}

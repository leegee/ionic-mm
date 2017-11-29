import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BatmanPage } from './batman';
@NgModule({
  declarations: [
    BatmanPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BatmanPage)
  ],
})
export class DogePageModule {}

import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuccPage } from './succ';
@NgModule({
  declarations: [
    SuccPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SuccPage)
  ],
})
export class SuccModule {}

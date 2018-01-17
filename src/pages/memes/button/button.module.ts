import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ButtonPage } from './button';
@NgModule({
  declarations: [
    ButtonPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ButtonPage)
  ],
})
export class DogePageModule {}

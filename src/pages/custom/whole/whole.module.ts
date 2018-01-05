import { CustomTextComponent } from './../../../components/custom-text/custom-text';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomWholePage } from './whole';
import { StylePopoverPage } from '../style-popover';

@NgModule({
  declarations: [
    CustomWholePage,
    CustomTextComponent,
    StylePopoverPage
  ],
  imports: [
    IonicPageModule.forChild(CustomWholePage)
  ],
})
export class CustomWholePageModule {}

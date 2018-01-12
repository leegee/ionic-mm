import { CustomTextComponent } from './../../../components/custom-text/custom-text';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomTopBottomPage } from './top-bottom';

@NgModule({
  declarations: [
    CustomTextComponent
  ],
  imports: [
    IonicPageModule.forChild(CustomTopBottomPage)
  ],
})
export class CustomTopBottomPageModule {}

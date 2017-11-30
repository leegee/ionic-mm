import { CustomTextComponent } from './../../components/custom-text/custom-text';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPage } from './custom';

@NgModule({
  declarations: [
    CustomPage,
    CustomTextComponent
  ],
  imports: [
    IonicPageModule.forChild(CustomPage),
  ],
})
export class CustomPageModule {}

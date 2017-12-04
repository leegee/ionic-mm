import { CustomTextComponent } from './../../components/custom-text/custom-text';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPage } from './custom';
import { StylePopoverPage } from './StylePopoverPage';

@NgModule({
  declarations: [
    CustomPage,
    CustomTextComponent,
    StylePopoverPage
  ],
  imports: [
    IonicPageModule.forChild(CustomPage)
  ],
})
export class CustomPageModule {}

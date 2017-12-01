import { CustomTextComponent } from './../../components/custom-text/custom-text';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomPage } from './custom';
import { PopoverPage } from './PopoverPage';

@NgModule({
  declarations: [
    CustomPage,
    CustomTextComponent,
    PopoverPage
  ],
  imports: [
    IonicPageModule.forChild(CustomPage)
  ],
})
export class CustomPageModule {}

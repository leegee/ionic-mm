import { CustomBlankPage } from './../blank/blank';
import { CustomTextComponent } from './../../../components/custom-text/custom-text';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CustomBlankPage,
    CustomTextComponent
  ],
  imports: [
    IonicPageModule.forChild(CustomBlankPage)
  ],
})
export class CustomBlankPageModule {}

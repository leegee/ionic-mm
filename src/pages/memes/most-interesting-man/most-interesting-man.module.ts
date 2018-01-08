import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MostInterestingManPage } from './most-interesting-man';
@NgModule({
  declarations: [
    MostInterestingManPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MostInterestingManPage)
  ],
})
export class MostInterestingManPageModule {}

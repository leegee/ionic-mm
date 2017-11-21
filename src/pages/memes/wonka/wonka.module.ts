import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WonkaPage } from './wonka';
@NgModule({
  declarations: [
    WonkaPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(WonkaPage)
  ],
})
export class WonkaPageModule {}

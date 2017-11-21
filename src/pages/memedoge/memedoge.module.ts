import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemedogePage } from './memedoge';
@NgModule({
  declarations: [
    MemedogePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MemedogePage)
  ],
})
export class MemedogePageModule {}

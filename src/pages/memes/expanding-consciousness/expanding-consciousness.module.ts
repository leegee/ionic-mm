import { ExpandingConsciousness } from './expanding-consciousness';
import { ComponentsModule } from '../../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ExpandingConsciousness
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ExpandingConsciousness)
  ],
})
export class ExpandingConsciousnessModule {}

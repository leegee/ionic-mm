import { IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBlockComponent } from './text-block/text-block';
@NgModule({
	declarations: [TextBlockComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule.forRoot(TextBlockComponent)
	],
	exports: [TextBlockComponent]
})
export class ComponentsModule {}

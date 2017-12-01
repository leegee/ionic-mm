import { CustomTextJaggedComponent } from './custom-text-jagged/custom-text-jagged';
import { IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBlockComponent } from './text-block/text-block';
import { Meme } from './meme/meme';
import { CustomTextComponent } from './custom-text/custom-text';
@NgModule({
	declarations: [
		TextBlockComponent,
		CustomTextComponent,
		CustomTextJaggedComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule.forRoot(TextBlockComponent),
		IonicModule.forRoot(Meme),
		IonicModule.forRoot(CustomTextJaggedComponent)
	],
	exports: [
		TextBlockComponent,
		CustomTextComponent,
		CustomTextJaggedComponent
	]
})
export class ComponentsModule { }

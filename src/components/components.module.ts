import { CustomTextJaggedComponent } from './custom-text-jagged/custom-text-jagged';
import { IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBlockComponent } from './text-block/text-block';
import { Meme } from './meme/meme';
import { CustomTextComponent } from './custom-text/custom-text';
import { ColorPickerPopoverComponent } from './color-picker-popover/color-picker-popover';
@NgModule({
	declarations: [
		TextBlockComponent,
		CustomTextComponent,
		CustomTextJaggedComponent,
    ColorPickerPopoverComponent
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
		CustomTextJaggedComponent,
    ColorPickerPopoverComponent
	]
})
export class ComponentsModule { }

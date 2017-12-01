import { Component, ElementRef, AfterViewChecked  } from '@angular/core';
import { CustomTextComponent } from '../custom-text/custom-text';

@Component({
  selector: 'custom-text-jagged',
  templateUrl: 'custom-text-jagged.html'
})
export class CustomTextJaggedComponent extends CustomTextComponent implements AfterViewChecked {

  private static reWordMaybeSpace = new RegExp(/(\S+)(\s+)?/g);

  public config: { [key: string]: any } = {
    requiredLineLengthsPx: [10, 5, 10],
    fontSize: 5,
    leading: 0.1
  };

//   constructor(
//     private _elRef: ElementRef
//   ) {
//       super(_elRef);
//   }

  ngAfterViewChecked() {
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('textarea');
    }
  }

  /*
    Flow text into lines of specific lengths.
    Requires textbox overflow: auto;
   */
  flow(unFlowedText: string) {
    let rv = "";
    let line = {
      number: 1,
      content: '',
      width: 0,
      newWidth: 0
    };

    unFlowedText = unFlowedText.replace(/\s+/g, " ");
    let m;

    // Iterate over each word, including its trailing space:
    while ((m = CustomTextJaggedComponent.reWordMaybeSpace.exec(unFlowedText)) &&
      line.number <= this.config.requiredLineLengthsPx.length
    ) {
      let word = m[1];
      let trailingSpaces = m[2];
      let wordWidth = word.length === 0 ? 0 : this.getChrWidth(word);
      line.newWidth = line.width + this.widthOfASpace + wordWidth;

      // If a word was found:
      if (wordWidth) {
        // Doesn't fit?
        if (line.newWidth > this.config.requiredLineLengthsPx[line.number - 1]) {
          // If there is space for a new line on card
          if (line.number <= this.config.requiredLineLengthsPx.length) {
            rv += line.content + "\n" + word;
            line.content = '';
            line.width = 0;
            line.number++;
          }
        }
        // Fits
        else {
          line.content += word;
          line.width = line.newWidth;
        }
      }

      // If a space was found, replace it - unless previous word ended with newline:
      if (trailingSpaces) {
        if (trailingSpaces.match(/[\n\r\f]/g)) {
          rv += line.content + "\n";
          line.content = '';
          line.width = 0;
          line.number++;
        }
        else {
          line.width += this.widthOfASpace * trailingSpaces.length;
          line.content += trailingSpaces;
        }
      }
    } // whend

    // Just empty lines at the start?
    m = unFlowedText.match(/^(\s+)/);
    let initialSpace = m ? m[1] : '';

    if (line.number <= this.config.requiredLineLengthsPx.length && line.width > 0) {
      rv += line.content;
    }

    this.text = initialSpace + rv;
  }

}

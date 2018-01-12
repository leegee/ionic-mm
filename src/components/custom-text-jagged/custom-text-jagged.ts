import { TextRenderer } from './../text-renderer';
import { Component, Input } from '@angular/core';
import { TextBlockInterface } from '../text-block-interface';

@Component({
  selector: 'custom-text-jagged',
  templateUrl: 'custom-text-jagged.html'
})
export class CustomTextJaggedComponent extends TextRenderer implements TextBlockInterface {

  private static reWordMaybeSpace = new RegExp(/(\S+)(\s+)?/g);
  protected elTextInput: HTMLInputElement;
  isHidden: false;

  @Input('text') text = '';
  @Input('id') id: string;

  private widthOfASpace: number;

  public config: { [key: string]: any } = {
    requiredLineLengthsPx: [10, 5, 10],
    fontSize: 5,
    leading: 0.1
  };

  getChrWidth(chrs: string) {
    chrs = chrs.replace(/\s/g, '_');
    let el = document.createElement('span');
    el.setAttribute('class', 'text');
    el.setAttribute('style',
      'fontSize:' + this.config.fontSize + 'vh;' + 'position: "absolute";left: 0;top: 0'
    );
    el.innerHTML = chrs;
    let rv = 0;
    if (this.elTextInput) {
      this.elTextInput.parentElement.appendChild(el);
      rv = el.getBoundingClientRect().width;
      el.outerHTML = '';
    }
    return rv;
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

  setPosition() {
    throw new Error('Not implemented');
  }

}

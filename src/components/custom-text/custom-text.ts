import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent implements AfterViewChecked {

  private static reWordMaybeSpace = new RegExp(/(\S+)(\s+)?/g);
  public id: string = "meme-text-container";
  public text: string = "Type here!";
  private el: HTMLInputElement;
  private running: boolean;
  private widthOfASpace: number;
  private oldTextValue: string;

  private _fontSize: number;
  get fontSize(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(this.config.fontSize + 'vh');
  }

  private _lineHeight: number;
  get getLineHeight(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle((this.config.fontSize + this.config.leading) + 'vh');
  }

  private config: { [key: string]: any } = {
    requiredLineLengthsPx: [10, 5, 10],
    fontSize: 5,
    leading: 0.1
  };

  constructor(
    private elRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    this.widthOfASpace = this.getChrWidth('_');
  }

  ngAfterViewChecked() {
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('#' + this.id);
    }
  }

  onFocus(e) {
    console.log('Focus');
  }

  onInput(e: KeyboardEvent) {
    if (!this.running && !e.ctrlKey) {
      this.running = true;
      let caret = this.el.selectionStart;

      let caretAtEnd = caret == this.el.innerHTML.length;

      this.oldTextValue = this.text;
      this.text = this.flow(this.oldTextValue);

      if (caretAtEnd) {
        caret = this.el.innerHTML.length;
      }

      this.el.focus();
      this.el.setSelectionRange(caret, caret);
      this.el.focus();

      this.running = false;
    }
  }

  flow(unFlowedText: string) {
    console.log('flow ', unFlowedText);
    let rv = "";
    let line = {
      number: 1,
      content: '',
      width: 0,
      newWidth: 0
    };

    // unFlowedText = unFlowedText.replace(/\n/g, " ");
    unFlowedText = unFlowedText.replace(/\s+/g, " ");
    // unFlowedText = unFlowedText.replace(/(\S+)\n(\S+)/g, function (str, pre, post) {
    //   return pre + ' ' + post
    // });
    // unFlowedText = unFlowedText.replace(/(\s+)\n(\S+)/g, function (str, pre, post) {
    //   return pre + post
    // });
    // unFlowedText = unFlowedText.replace(/(\S+)\n(\s+)/g, function (str, pre, post) {
    //   return pre + post
    // });

    // let finalSpace = unFlowedText.match(/\s$/)) ? true : false;
    let m;

    // Iterate over each word, including its trailing space:
    while (m = CustomTextComponent.reWordMaybeSpace.exec(unFlowedText)) {
      let word = m[1];
      let trailingSpaces = m[2];
      let wordWidth = word == '' ? 0 : this.getChrWidth(word);
      line.newWidth = line.width + this.widthOfASpace + wordWidth;

      // If a word was found:
      if (wordWidth) {
        // Doesn't fit?
        console.log(
          'line.number: ', line.number, ' --- ',
          line.newWidth, this.config.requiredLineLengthsPx[line.number - 1]
        );
        if (line.newWidth > this.config.requiredLineLengthsPx[line.number - 1]) {
          // If there is space for a new line on card
          console.log('add new line');
          if (line.number <= this.config.requiredLineLengthsPx.length) {
            rv += line.content + "\n" + word;
            line.content = '';
            line.width = 0;
            line.number++;
          }
        }
        // Fits
        else {
          if (line.number <= this.config.requiredLineLengthsPx.length) {
            line.content += word;
            line.width = line.newWidth;
          }
        }
      }

      // If a space was found, replace it - unless previous word ended with newline:
      if (trailingSpaces && line.number <= this.config.requiredLineLengthsPx.length) {
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

    return initialSpace + rv;
  }

  private getChrWidth(chrs: string) {
    chrs = chrs.replace(/\s/g, '_');
    let el = document.createElement('span');
    el.setAttribute('class', 'text');
    el.setAttribute('style',
      'fontSize:' + this.config.fontSize + 'vh;' + 'position: "absolute";left: 0;top: 0'
      // TODO lineheight
    );
    el.innerHTML = chrs;
    let rv = 0;
    if (this.el) { // For TS
      this.el.parentElement.appendChild(el);
      rv = el.getBoundingClientRect().width;
      el.outerHTML = '';
    }
    return rv;
  }
}
import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the CustomTextComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent implements AfterViewChecked {
  public id: string = "meme-text-container";
  public text: string = "Type here!";
  private el: HTMLElement;
  private running: boolean;
  private options = {
    container: null,
    requiredLineLengthsPx: [100, 100],
    selectListElement: null,
    selectListIndex: null,
    textInput: null,
    fontSizept: 24,
    leading: 8
  };
  private widthOfASpace: number;
  private oldTextValue: string;

  constructor(
    private elRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    this.widthOfASpace = this.getChrWidth(' ');
    // this.el = this.elRef.nativeElement.querySelector('#' + this.id);
  }

  ngAfterViewChecked() {
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('#' + this.id);
      // } else {
      // console.log('Tried to re-get an element');
    }
  }

  style() {
    return <string>this.sanitizer.bypassSecurityTrustStyle(
      'fontSize: ' + this.options.fontSizept + 'pt; '
      + 'lineSpacing: ' + (this.options.fontSizept + this.options.leading) + 'pt'
    );
  }

  onFocus(e) {
    console.log('Focus');
  }

  keyDown(e:KeyboardEvent) {
    this.oldTextValue = e.target.innerHTML;
  }

  keyUp(e:KeyboardEvent) {
    console.log(e);
    if (!this.running && !e.ctrlKey) {
      this.running = true;
      let caret = this.el.selectionStart;

      let caretAtEnd = caret == e.target.innerHTML.length;

      this.oldTextValue = e.target.innerHTML;
      this.text = this.flow(e.target.innerHTML);

      if (caretAtEnd) caret = e.target.innerHTML.length;

      this.el.focus();
      this.el.setSelectionRange(caret, caret);
      this.el.focus();

      // if (this.el.createTextRange) {
      //   var range = this.el.createTextRange();
      //   range.move('character', caret);
      //   range.select();
      // }

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
    let finalSpace = false;

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

    if (unFlowedText.match(/\s$/)) finalSpace = true;
    let wordMaybeSpace = new RegExp(/(\S+)(\s+)?/g);
    let m;
    while (m = wordMaybeSpace.exec(unFlowedText)) {
      let word = m[1];
      let space = m[2];

      let wordWidth = word == '' ? 0 : this.getChrWidth(word);
      line.newWidth = line.width + this.widthOfASpace + wordWidth;

      // Doesn't fit?
      if (wordWidth) {
        if (line.newWidth > this.options.requiredLineLengthsPx[line.number - 1]) {
          // If there is space for a new line on card
          if (line.number <= this.options.requiredLineLengthsPx.length) {
            rv += line.content + "\n" + word;
            line.content = '';
            line.width = 0;
            line.number++;
          }
        }
        // Fits
        else {
          if (line.number <= this.options.requiredLineLengthsPx.length) {
            line.content += word;
            line.width = line.newWidth;
          }
        }
      }

      // Replace space unless word ended with newline:
      if (space
        && line.number <= this.options.requiredLineLengthsPx.length
      ) {
        let lf = space.match(/[\n\n\f]/g);
        if (lf) {
          rv += line.content + "\n";
          line.content = '';
          line.width = 0;
          line.number += 1;
        }
        else {
          line.width += this.widthOfASpace * space.length;
          line.content += space;
        }
      }
    } // whend

    // Just empty lines at the start
    m = unFlowedText.match(/^(\s+)/);
    let initialSpace = m ? m[1] : '';

    if (line.number <= this.options.requiredLineLengthsPx.length && line.width > 0)
      rv += line.content;

    return initialSpace + rv;
  }

  private getChrWidth(chrs: string) {
    let style = this.sanitizer.bypassSecurityTrustStyle(
      // fontFamily:
      'fontSize:' + this.options.fontSizept + 'pt;' +
      'position: "absolute";left: 0;top: 0'
    );

    chrs = chrs.replace(/\s/g, '.');
    let el = document.createElement('div');
    el.setAttribute('class', 'text');
    el.setAttribute('style', <string>style);
    el.innerHTML = chrs;
    // document.body.appendChild(el);
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    return el.getBoundingClientRect().width;
  }
}
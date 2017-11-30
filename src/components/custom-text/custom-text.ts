import { Component, ElementRef, AfterViewChecked, Input } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent implements AfterViewChecked {

  @Input('width') public width: string;
  @Input('height') public height: string;

  private static reWordMaybeSpace = new RegExp(/(\S+)(\s+)?/g);
  private static fontScaleUnit: number = 1;

  public config: { [key: string]: any } = {
    requiredLineLengthsPx: [10, 5, 10],
    fontSize: 5,
    leading: 0.1
  };

  public placeholder: string = "Type here";
  public text: string = '';
  private el: HTMLInputElement;
  private running: boolean;
  private widthOfASpace: number;
  private oldTextValue: string;

  public fontSize: number;

  constructor(
    private elRef: ElementRef
  ) {
    this.widthOfASpace = this.getChrWidth('_');
    this.fontSize = this.config.fontSize;
  }

  ngAfterViewChecked() {
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('textarea');
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

  // Requires textbox overflow: auto;
  flowFitIrregular(unFlowedText: string) {
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
    while ((m = CustomTextComponent.reWordMaybeSpace.exec(unFlowedText)) &&
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

  flow(text: string) {
    let shrunk = false;
    let hasHorizontalScrollbar = this.el.scrollWidth > this.el.clientWidth;
    let hasVerticalScrollbar = this.el.scrollHeight > this.el.clientHeight;

    // While text fits  bounding box, expand font size
    // While text does not fit bounding box, contract  font size

    if (!hasHorizontalScrollbar && !hasVerticalScrollbar) {
      this.fontSize += CustomTextComponent.fontScaleUnit;
    } else {
      this.fontSize -= CustomTextComponent.fontScaleUnit;
      shrunk = true;
    }

    this.el.style.fontSize = this.fontSize + 'vh';

    console.log(this.fontSize, hasHorizontalScrollbar, this.width, 'x', this.height);

    if (this.fontSize > 100) shrunk = true;

    return shrunk ? text : this.flow(text);
  }
}

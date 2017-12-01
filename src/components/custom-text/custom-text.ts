import { Component, ElementRef, AfterViewChecked  } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent {

  private static fontScaleBy: number = 0.1;

  public config: { [key: string]: any } = {
    requiredLineLengthsPx: [10, 5, 10],
    fontSize: 5,
    leading: 0.1
  };

  public placeholder: string = "Type here";
  public text: string = '';
  public fontSize: number;

  protected el: HTMLInputElement;

  private running: boolean;
  protected widthOfASpace: number;
  private oldTextValue: string;

  constructor(
    protected elRef: ElementRef
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
    // this.fontSize = this.config.fontSize;
    // this.el.style.fontSize = this.fontSize + 'vh';
    // console.log('focus');
  }

  sizeText(e: KeyboardEvent) {
    if (!this.running && !e.ctrlKey) {
      this.running = true;
      let caret = this.el.selectionStart;

      let caretAtEnd = caret == this.el.innerHTML.length;

      this.oldTextValue = this.text;
      this.flow(this.oldTextValue);

      if (caretAtEnd) {
        caret = this.el.innerHTML.length;
      }

      this.el.focus();
      this.el.setSelectionRange(caret, caret);
      this.el.focus();

      this.running = false;
    }
  }

  getChrWidth(chrs: string) {
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

  /* Fit text to bouds */
  flow(text: string) {
    let hasHorizontalScrollbar;
    let hasVerticalScrollbar;

    // While text fits  bounding box, expand font size
    do {
      hasHorizontalScrollbar = this.el.scrollWidth > this.el.offsetWidth;
      hasVerticalScrollbar = this.el.scrollHeight > this.el.offsetHeight;
      if (!hasHorizontalScrollbar && !hasVerticalScrollbar) {
        this.fontSize += CustomTextComponent.fontScaleBy;
        this.el.style.fontSize = this.fontSize + 'vh';
      }
    } while (!hasHorizontalScrollbar && !hasVerticalScrollbar);

    // While text does not fit bounding box, contract  font size
    do {
      hasHorizontalScrollbar = this.el.scrollWidth > this.el.offsetWidth;
      hasVerticalScrollbar = this.el.scrollHeight > this.el.offsetHeight;
      if (hasHorizontalScrollbar || hasVerticalScrollbar) {
        this.fontSize -= CustomTextComponent.fontScaleBy;
        this.el.style.fontSize = this.fontSize + 'vh';
      }
    } while (hasHorizontalScrollbar || hasVerticalScrollbar);

    // console.log(
    //   "Font %s, scrollbar? %s,%s, %s x %s",
    //   this.fontSize, hasHorizontalScrollbar,
    //   hasVerticalScrollbar,
    //   this.width, this.height
    // );

    this.text = text;
  }
}

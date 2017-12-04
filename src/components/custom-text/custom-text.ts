import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { MemeStyleService } from '../../services/MemeStyleService';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent implements AfterViewChecked, OnDestroy {
  private static fontScaleBy: number = 0.1;
  public userSettingsSubscription: Subscription;
  public config: { [key: string]: any } = {
    requiredLineLengthsPx: [10, 5, 10],
    fontSize: 5,
    leading: 0.1
  };
  public placeholder: string = "Type here";
  public text: string = '';
  public fontSize: number;
  private style;
  protected el: HTMLInputElement;
  private running: boolean;
  protected widthOfASpace: number;
  private oldTextValue: string;

  constructor(
    private MemeStyleService: MemeStyleService,
    protected elRef: ElementRef,
    private domSanitizer: DomSanitizer
  ) {
    this.widthOfASpace = this.getChrWidth('_');
    this.fontSize = this.config.fontSize;
    this.userSettingsSubscription = this.MemeStyleService.changeAnnounced$.subscribe(
      (changed: { [key: string]: any }) => {
        console.log('SUBSCRIPTION: ', changed);
        if (changed.style) {
          this.style = changed.style;
        }
      }
    );
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.userSettingsSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('textarea');
    }
  }

  getStyle() {
    let styleAtrStr = 'font-size:' + this.fontSize + 'vh;';
    for (let rule in this.style) {
      styleAtrStr += rule + ':' + this.style[rule] + ';';
    }
    console.log('getStyle: ', styleAtrStr);
    return this.domSanitizer.bypassSecurityTrustStyle( styleAtrStr );
  }

  onFocus(e) { }

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
    let rv = 0;
    if (this.el) { // For TS
      chrs = chrs.replace(/\s/g, '_');
      let el = document.createElement('span');
      el.setAttribute('class', 'text');
      el.setAttribute('style',
        'fontSize:' + this.config.fontSize + 'vh;' + 'position: "absolute";left: 0;top: 0'
        // TODO lineheight
      );
      el.innerHTML = chrs;
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

    console.log(
      "FLOW Font %s, h-scroll %s, v-scroll %s",
      this.fontSize, hasHorizontalScrollbar, hasVerticalScrollbar, this.style
    );
  }
}

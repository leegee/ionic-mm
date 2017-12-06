import { Md5 } from 'ts-md5/dist/md5';
import { StylePopoverPage } from './../../pages/custom/style-popover';
import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { MemeStyleService } from '../../services/MemeStyleService';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DomSanitizer } from '@angular/platform-browser';
import { TextBlockInterface } from '../text-block-interface';

@Component({
  selector: 'custom-text',
  templateUrl: 'custom-text.html'
})
export class CustomTextComponent implements TextBlockInterface, AfterViewChecked, OnDestroy {
  private static FONT_SCALE_BY: number = 0.05;
  private static DEBOUNCE_DELAY_MS = 333;
  public userSettingsSubscription: Subscription;
  public placeholder: string = "Type here";
  public text: string = '';
  public fontSize: number = 2;
  protected el: HTMLInputElement;
  private running: boolean;
  private style: {};
  private oldTextValue: string;

  constructor(
    private MemeStyleService: MemeStyleService,
    protected elRef: ElementRef,
    private domSanitizer: DomSanitizer
  ) {
    this.userSettingsSubscription = this.MemeStyleService.changeAnnounced$.subscribe(
      (changed: { [key: string]: any }) => {
        this.style = Object.assign(this.style, changed);
        this.sizeText();
      }
    );
    this.style = StylePopoverPage.initialState;
  }

  ngOnDestroy() {
    this.userSettingsSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.el) {
      this.el = this.elRef.nativeElement.querySelector('textarea');
    }
  }

  getStyleAttr() {
    let styleAtrStr = 'font-size:' + this.fontSize + 'vh;';
    for (let rule in this.style) {
      styleAtrStr += rule + ':' + this.style[rule] + ';';
    }
    return this.domSanitizer.bypassSecurityTrustStyle(styleAtrStr);
  }

  onFocus(e) { }

  sizeText(e?: KeyboardEvent) {
    let noModifierKey = !e || !e.ctrlKey;
    if (!this.running && noModifierKey) {
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


  /* Fit text to bouds */
  flow(text: string) {
    let hasHorizontalScrollbar;
    let hasVerticalScrollbar;

    // While text fits  bounding box, expand font size
    do {
      hasHorizontalScrollbar = this.el.scrollWidth > this.el.offsetWidth;
      hasVerticalScrollbar = this.el.scrollHeight > this.el.offsetHeight;
      if (!hasHorizontalScrollbar && !hasVerticalScrollbar) {
        this.fontSize += CustomTextComponent.FONT_SCALE_BY;
        this.el.style.fontSize = this.fontSize + 'vh';
      }
    } while (!hasHorizontalScrollbar && !hasVerticalScrollbar);

    // While text does not fit bounding box, contract  font size
    do {
      hasHorizontalScrollbar = this.el.scrollWidth > this.el.offsetWidth;
      hasVerticalScrollbar = this.el.scrollHeight > this.el.offsetHeight;
      if (hasHorizontalScrollbar || hasVerticalScrollbar) {
        this.fontSize -= CustomTextComponent.FONT_SCALE_BY;
        this.el.style.fontSize = this.fontSize + 'vh';
      }
    } while (hasHorizontalScrollbar || hasVerticalScrollbar);
  }

  getText() {
    return this.text;
  }

  getStyledElement() {
    return this.el;
  }

  getStyledParentElement() {
    return this.elRef.nativeElement;
  }

}

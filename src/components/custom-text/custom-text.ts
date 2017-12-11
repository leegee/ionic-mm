import { TextRenderer } from './../text-renderer';
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
export class CustomTextComponent extends TextRenderer implements TextBlockInterface, AfterViewChecked, OnDestroy {
  private static FONT_SCALE_BY: number = 0.05;
  public userSettingsSubscription: Subscription;
  public placeholder: string = "Type here";
  public text: string = '';
  private fontSize: number = 2;
  protected elTextInput: HTMLInputElement;
  private running: boolean;
  private style: {};

  constructor(
    private MemeStyleService: MemeStyleService,
    protected elRef: ElementRef,
    private domSanitizer: DomSanitizer
  ) {
    super();
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
    if (!this.elTextInput) {
      this.elTextInput = this.elRef.nativeElement.querySelector('textarea');
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
      console.log('Sizing text');
      this.running = true;
      let caret = this.elTextInput.selectionStart;

      let caretAtEnd = caret == this.elTextInput.innerHTML.length;

      this.flow(this.text);

      if (caretAtEnd) {
        caret = this.elTextInput.innerHTML.length;
      }

      this.elTextInput.focus();
      this.elTextInput.setSelectionRange(caret, caret);
      this.elTextInput.focus();
      this.running = false;
    }
  }

  /* Fit text to bouds */
  flow(text: string) {
    let hasHorizontalScrollbar;
    let hasVerticalScrollbar;

    // While text fits  bounding box, expand font size
    do {
      hasHorizontalScrollbar = this.elTextInput.scrollWidth > this.elTextInput.offsetWidth;
      hasVerticalScrollbar = this.elTextInput.scrollHeight > this.elTextInput.offsetHeight;
      console.log(this.elTextInput.scrollHeight ," ", this.elTextInput.offsetHeight);
      if (!hasHorizontalScrollbar && !hasVerticalScrollbar) {
        this.fontSize += CustomTextComponent.FONT_SCALE_BY;
        this.elTextInput.style.fontSize = this.fontSize + 'vh';
      }
    } while (!hasHorizontalScrollbar && !hasVerticalScrollbar);

    // While text does not fit bounding box, contract  font size
    do {
      hasHorizontalScrollbar = this.elTextInput.scrollWidth > this.elTextInput.offsetWidth;
      hasVerticalScrollbar = this.elTextInput.scrollHeight > this.elTextInput.offsetHeight;
      if (hasHorizontalScrollbar || hasVerticalScrollbar) {
        this.fontSize -= CustomTextComponent.FONT_SCALE_BY;
        this.elTextInput.style.fontSize = this.fontSize + 'vh';
      }
    } while (hasHorizontalScrollbar || hasVerticalScrollbar);
  }

  getText() {
    return this.text;
  }

  /*
    The computed style for this.elTextInput does not reflect its actual position on the screen.
    Nor can CSSStyleDeclarations be cast to objecrts
  */
  getStyles() {
    function toObj(styles){
      let rv = {};
      for (let rule in styles) {
        rv[rule] = styles[rule];
      }
      return rv;
    }

    let elWithFont = toObj(document.defaultView.getComputedStyle(
      this.elTextInput
    ));
    let elWithPos = toObj(document.defaultView.getComputedStyle(
      this.elRef.nativeElement
    ));
    let fontStyles = Object.keys(elWithFont)
      .filter(ruleName => {
        return ruleName.match(/^font/)
      })
      .reduce((styles, ruleName) => {
        styles[ruleName] = elWithFont[ruleName];
        return styles;
      },
      {}
      );
    return Object.assign(elWithPos, fontStyles);
  }

}

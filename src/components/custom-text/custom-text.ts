import { TextRenderer } from './../text-renderer';
import { StylePopoverPage } from './../../pages/custom/style-popover';
import { Component, ElementRef, AfterViewChecked, Input } from '@angular/core';
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

  @Input('style') styleInput;
  @Input('text') text = '';

  private static FONT_SCALE_BY: number = 0.025;
  public userSettingsSubscription: Subscription;
  public placeholder: string = "Type here";
  private fontSize: number = 2;
  protected elTextInput: HTMLInputElement;
  private running: boolean;
  private style: {};
  private x: number;
  private y: number;
  protected container: HTMLElement;
  private doneInit = false;
  private stylesFromElementMarkup = {
    'color': true,
    'background': true,
    'backgroundColor': true,
    '-webkit-text-stroke': true,
    '-webkit-text-stroke-width': true,
    '-webkit-text-stroke-colour': true
  };

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
    // this.style = StylePopoverPage.initialState;
    // TODO - set the style-popover initial state here!
  }

  ngOnDestroy() {
    this.userSettingsSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.elTextInput) {
      this.elTextInput = this.elRef.nativeElement.querySelector('textarea');
      // console.log('*** ', this.styleInput);
      if (!this.doneInit) {
        this.sizeText();
        this.doneInit = true;
      }
    }
  }

  getStyleAttr() {
    let styleAtrStr = 'font-size:' + this.fontSize + 'vh;';

    // replace this with getComputedStyles
    for (let rule of this.styleInput.split(/;+/)) {
      let [, prop] = rule.match(/^\s*([^:\s]+)/);
      if (this.stylesFromElementMarkup.hasOwnProperty(prop) && (!this.style || !this.style.hasOwnProperty(prop))) {
        styleAtrStr += rule + ';';
      }
    }

    for (let prop in this.style) {
      styleAtrStr += prop + ':' + this.style[prop] + ';';
    }

    // console.log('style on text input=', styleAtrStr);
    return this.domSanitizer.bypassSecurityTrustStyle(styleAtrStr);
  }

  onFocus(e) { }

  sizeText(e?: KeyboardEvent) {
    let noModifierKey = !e || !e.ctrlKey;
    if (!this.running && noModifierKey) {
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

  hasScrollbars() {
    return (this.elTextInput.scrollWidth >= this.elTextInput.offsetWidth)
      || (this.elTextInput.scrollWidth > this.elTextInput.clientWidth)
      || (this.elTextInput.scrollHeight >= this.elTextInput.offsetHeight)
      || (this.elTextInput.scrollHeight > this.elTextInput.clientHeight);
  };

  /* Fit text to bouds */
  flow(text: string) {
    // While text fits  bounding box, expand font size
    do {
      if (!this.hasScrollbars()) {
        this.fontSize += CustomTextComponent.FONT_SCALE_BY;
        this.elTextInput.style.fontSize = this.fontSize + 'vh';
      }
    } while (!this.hasScrollbars());

    // While text does not fit bounding box, contract  font size
    // do {
    //   if (this.hasScrollbars()) {
    //     this.fontSize -= CustomTextComponent.FONT_SCALE_BY;
    //     this.elTextInput.style.fontSize = this.fontSize + 'vh';
    //   }
    // } while (this.hasScrollbars());
  }

  getText() {
    return this.text;
  }

  /*
    The computed style for this.elTextInput does not reflect its actual position on the screen.
    Nor can CSSStyleDeclarations be cast to objecrts
  */
  getStyles() {
    function toObj(styles) {
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

    console.log('el with pos = this.elRef.nativeElement =', this.elRef.nativeElement);

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

  onTouchStart(e) {
    this.x = e.touches[0].clientX;
    this.y = e.touches[0].clientY;
  }

  onTouchMove(e) {
    this.elRef.nativeElement.style.left = parseInt(this.elRef.nativeElement.style.left) +
      (e.touches[0].clientX - this.x) + 'px';
    this.elRef.nativeElement.style.top = parseInt(this.elRef.nativeElement.style.top) +
      (e.touches[0].clientY - this.y) + 'px';
    this.x = e.touches[0].clientX;
    this.y = e.touches[0].clientY;
    console.log(e)
  }
}

import { PopoverController } from 'ionic-angular';
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

  @Input('style') styleInput = '';
  @Input('text') text = '';
  @Input('id') id: string;
  @Input('isHidden') isHidden = false;

  private static RESIZE_HANDLE_PX = 20;
  private static FONT_SCALE_BY: number = 0.025;
  private static TOUCH_DELAY_MS = 300;
  public userSettingsSubscription: Subscription;
  public placeholder: string = "Type here";
  private fontSize: number = 2;
  protected elTextInput: HTMLInputElement;
  private touching = false;
  private running: boolean;
  private style: { [key: string]: string } = {};
  private left: string = '';
  private top: string = '';
  private clientX: number;
  private clientY: number;
  protected container: HTMLElement;
  private lastTouchTimeStamp = 0;
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
    private domSanitizer: DomSanitizer,
    public popoverCtrl: PopoverController
  ) {
    super();
    // this.style = StylePopoverPage.initialState;
    // TODO - set the style-popover initial state here!
  }

  ngOnDestroy() {
    // this.userSettingsSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (!this.elTextInput) {
      this.elTextInput = this.elRef.nativeElement.querySelector('textarea');
      if (this.isVisible()) {
        this.sizeText();
      }
    }
  }

  isVisible() {
    return this.elRef.nativeElement.offsetParent !== null;
  }

  getStyleAttr() {
    let styleAtrStr = 'font-size:' + this.fontSize + 'vh;';

    //  replace this with getComputedStyles
    for (let rule of this.styleInput.split(/;+/)) {
      if (rule.length) {
        let [, prop] = rule.match(/^\s*([^:\s]+)/);
        if (this.stylesFromElementMarkup.hasOwnProperty(prop) && (!this.style || !this.style.hasOwnProperty(prop))) {
          styleAtrStr += rule + ';';
        }
      }
    }

    // User styles
    for (let prop in this.style) {
      styleAtrStr += prop + ':' + this.style[prop] + ';';
    }

    // console.log('style on text input=', styleAtrStr);
    return this.domSanitizer.bypassSecurityTrustStyle(styleAtrStr);
  }

  /*
    The computed style for this.elTextInput does not reflect its actual position on the screen.
    Nor can CSSStyleDeclarations be cast to objecrts
  */
  getStyles() {
    let elStylesWithFont = this._stylesForElement(this.elTextInput);

    let elStylesWithPos = this._stylesForElement(this.elRef.nativeElement);

    let fontStyles = Object.keys(elStylesWithFont)
      .filter(ruleName => {
        return ruleName.match(/^(textAlign|line|font)/)
      })
      .reduce((styles, ruleName) => {
        styles[ruleName] = elStylesWithFont[ruleName];
        return styles;
      },
      {}
      );

    return Object.assign(elStylesWithPos, fontStyles);
  }

  onFocus(e) { }

  sizeText(e?: KeyboardEvent) {
    if (!this.touching) {
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
  }

  /* Fit text to bouds */
  flow(text: string) {
    // While text fits  bounding box, expand font size
    do {
      if (!this.hasScrollbars(this.elTextInput)) {
        this.fontSize += CustomTextComponent.FONT_SCALE_BY;
        this.elTextInput.style.fontSize = this.fontSize + 'vh';
      }
    } while (!this.hasScrollbars(this.elTextInput));

    // While text does not fit bounding box, contract  font size
    do {
      if (this.hasScrollbars(this.elTextInput)) {
        this.fontSize -= CustomTextComponent.FONT_SCALE_BY;
        this.elTextInput.style.fontSize = this.fontSize + 'vh';
      }
    } while (this.hasScrollbars(this.elTextInput));
  }

  getText() {
    return this.text;
  }

  private _stylesForElement(element: HTMLElement): { [key: string]: string } {
    let styles = document.defaultView.getComputedStyle(element);
    let rv = {};
    for (let rule in styles) {
      rv[rule] = styles[rule];
    }
    return rv;
  }

  onTouchStart(e) {
    this.touching = true;
    this.clientX = e.touches[0].clientX;
    this.clientY = e.touches[0].clientY;
  }

  onTouchEnd() {
    this.touching = false;
    this.sizeText();
  }

  onTouchMove(e) {
    if (e.touches[0].timeStamp - this.lastTouchTimeStamp < CustomTextComponent.TOUCH_DELAY_MS) {
      return;
    }
    this.lastTouchTimeStamp = e.touches[0].timeStamp;

    let elStyles: { [key: string]: any } = this._stylesForElement(this.elRef.nativeElement);
    ['left', 'top', 'width', 'height'].forEach(member => {
      elStyles[member] = parseFloat(elStyles[member]);
    })

    // Touch is around the textarea resize handle, bottom right:
    // Resize the text area, as default behaviour is 'lost' somehow, even without touch event capture
    if (Math.abs(this.clientX - elStyles.left) > elStyles.width - CustomTextComponent.RESIZE_HANDLE_PX &&
      Math.abs(this.clientY - elStyles.top) > elStyles.height - CustomTextComponent.RESIZE_HANDLE_PX
    ) {
      this.elRef.nativeElement.style.width = Math.abs(e.touches[0].clientX - elStyles.left) + 'px';
      this.elRef.nativeElement.style.height = Math.abs(e.touches[0].clientY - elStyles.top) + 'px';
      this.sizeText();
    }

    // Otherise, move the text box
    else {
      this.elRef.nativeElement.style.left = elStyles.left + (e.touches[0].clientX - this.clientX) + 'px';
      this.elRef.nativeElement.style.top = elStyles.top + (e.touches[0].clientY - this.clientY) + 'px';
    }

    this.clientX = e.touches[0].clientX;
    this.clientY = e.touches[0].clientY;
  }

  onMenuHandleClick(e) {
    this.presentPopover(e);
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(StylePopoverPage, {
      state: this.getStyles()
    });

    this.userSettingsSubscription = this.MemeStyleService.changeAnnounced$.subscribe(
      (changed: { [key: string]: any }) => {
        console.log('Style Changd', changed);
        this.style = Object.assign(this.style, changed);
        this.sizeText();
      }
    );

    popover.onDidDismiss(() => {
      this.userSettingsSubscription.unsubscribe();
    });

    popover.present({
      ev: event
    });
  }

  setPosition(x: number, y: number): void {
    console.log('Set Position', x, y);
    this.left = x + 'px';
    this.top = y + 'px';
  }

  getPositionStyle(){
    console.log('getPositionStyle', this.left,this.top)
    return this.domSanitizer.bypassSecurityTrustStyle(
      'position:absolute; width:200px; height:100px; left: ' + this.left + ';' + 'top: ' + this.top + ';'
    );
  }
}

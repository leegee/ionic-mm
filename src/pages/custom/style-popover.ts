import { MemeStyleService } from './../../services/MemeStyleService';
import { Component, EventEmitter, Output, ElementRef } from '@angular/core';
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { ColorPickerPopoverComponent } from '../../components/color-picker-popover/color-picker-popover';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
    templateUrl: 'style-popover.html'
})
export class StylePopoverPage {
    protected static stateDefaults = {
        '-webkit-text-stroke-color': 'white',
        '-webkit-text-stroke-width': '0',
        'font-family': 'Anton',
        'font-weight': 'normal',
        'overflow-wrap': 'break-word',
        'text-align': 'center',
        'white-space': 'noraml', // https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
        'word-wrap': 'break-word',
        'color': 'black',
        'background-color': 'transparent'
    };
    protected selections = {};
    protected state: { [key: string]: any } = {};

    constructor(
        public viewCtrl: ViewController,
        private domSanitizer: DomSanitizer,
        private memeStyleService: MemeStyleService,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        protected elRef: ElementRef
    ) {
        Object.keys(StylePopoverPage.stateDefaults).forEach(styleRuleName => {
            let camelised = this.camelise(styleRuleName);
            this.state[styleRuleName] = navParams.data.state[camelised] || StylePopoverPage.stateDefaults[styleRuleName];
        });
        this.initialiseSelectionsState();
        this.onChange();
    }

    public deleteHandler() {
        console.log('popup emit delete');
        this.close('delete');
    }

    private camelise(subject) {
        subject = subject.replace(/^-/, '');
        subject = subject.replace(/^([A-Z])|\-(\w)/g, function (match, p1, p2, offset) {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
        return subject;
    }

    public close(rv) {
        this.viewCtrl.dismiss(rv);
    }

    public closeAndReflow() {
        this.viewCtrl.dismiss();
        setTimeout(
            () => this.onChange()
        );

    }

    public onChange() {
        this.memeStyleService.set(this.selections2state());
    }

    private initialiseSelectionsState() {
        for (let rule in this.state) {
            if (rule === 'word-wrap' || rule === 'overflow-wrap') {
                this.selections[rule] = this.state[rule] === 'break-word' ? true : false;
            }
            else if (rule === 'white-space') {
                this.selections[rule] = this.state[rule] === 'no-wrap' ? true : false;
            }
            else {
                this.selections[rule] = this.state[rule];
            }
        }
    }

    private selections2state() {
        let newState = {};
        for (let rule in this.selections) {
            if (rule === 'word-wrap' || rule === 'overflow-wrap') {
                newState[rule] = this.selections[rule] ? 'break-word' : 'normal';
            }
            else if (rule === 'white-space') {
                newState[rule] = this.selections[rule] ? 'nowrap' : 'normal';
            }
            else {
                newState[rule] = this.selections[rule];
            }
        }

        console.log('after change', newState);
        return newState;
    }

    safeStyleValue(styleRuleName): SafeStyle {
        return this.domSanitizer.bypassSecurityTrustStyle(this.selections[styleRuleName]);
    }

    chooseColor(cssRuleName: string) {
        let modal = this.modalCtrl.create(ColorPickerPopoverComponent, {
            color: this.selections[cssRuleName]
        });

        modal.onDidDismiss((data) => {
            this.selections[cssRuleName] = data.color;
            this.onChange();
        });

        modal.present();
    }
}

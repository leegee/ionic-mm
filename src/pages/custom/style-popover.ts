import { MemeStyleService } from './../../services/MemeStyleService';
import { Component } from '@angular/core';
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
        'foreground-opacity': 1,
        'background-color': 'transparent',
        'background-opacity': 1,
    };
    protected selections = {};
    protected state: { [key: string]: any } = {};

    constructor(
        public viewCtrl: ViewController,
        private domSanitizer: DomSanitizer,
        private memeStyleService: MemeStyleService,
        public navParams: NavParams,
        public modalCtrl: ModalController
    ) {
        Object.keys(StylePopoverPage.stateDefaults).forEach(styleRuleName => {
            let camelised = this.camelise(styleRuleName);
            this.state[styleRuleName] = navParams.data.state[camelised] || StylePopoverPage.stateDefaults[styleRuleName];
        });
        this.initialiseSelectionsState();
        this.onChange();
    };

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

    public close() {
        console.log('close');
        this.viewCtrl.dismiss();
    }

    public closeAndReflow() {
        console.log('close and reflow');
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

        if (newState['foreground-opacity'] !== 1) {
            newState['color'] = this._opacity(newState['color'], newState['foreground-opacity']);
        }

        if (newState['background-opacity'] !== 1) {
            newState['background-color'] = this._opacity(newState['background-color'], newState['background-opacity']);
        }

        console.log('after change', newState);
        return newState;
    }

    private _opacity(color: string, opacity: number | string): string {
        console.log('opacity', color, opacity);
        let r, g, b;
        if (color.match(/^rgb/)) {
            [, r, g, b,] = color.match(/^rgba?\(([.\d]+),\s*([.\d]+),\s*([.\d]+)(,\s*([.\d]+)?)?\)$/);
        } else if (color.match(/^#/)) {
            [, r, g, b,] = color.match(/^#(..)(..)(..)(..)?$/);
            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
        }
        let a = Number(opacity);
        if (a > 0) {
            a = a / 100;
        }
        let rv = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        console.log('set ', rv);
        return rv;
    }

    safeStyle(styleRuleName): SafeStyle {
        return this.domSanitizer.bypassSecurityTrustStyle(styleRuleName + ':' + this.state[styleRuleName]);
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

    setTransparentBackground() {
        this.selections['background-color'] = 'transparent';
        this.onChange();
    }
}

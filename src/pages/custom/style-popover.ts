import { MemeStyleService } from './../../services/MemeStyleService';
import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { ColorPickerPopoverComponent } from '../../components/color-picker-popover/color-picker-popover';

@Component({
    templateUrl: 'style-popover.html'
})
export class StylePopoverPage {
    protected static stateDefaults = {
        '-webkit-text-stroke-color': 'white',
        '-webkit-text-stroke-width': '0',
        'font-family': 'Helvetica',
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
        return newState;
    }

    chooseColor(cssRule: string) {
        console.log('choose to replace ', cssRule, this.state[cssRule]);
        let modal = this.modalCtrl.create(ColorPickerPopoverComponent, {
            color: this.state[cssRule]
        });

        modal.onDidDismiss((data) => {
            console.log('closed colour picker, got ', data);
            // this.userSettingsSubscription.unsubscribe();
        });

        modal.present();

    }
}

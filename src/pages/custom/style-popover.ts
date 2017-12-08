import { MemeStyleService } from './../../services/MemeStyleService';
import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'style-popover.html'
})
export class StylePopoverPage {
    public selections = {};
    private state = {};
    public static initialState = {
        '-webkit-text-stroke-': '0',
        '-webkit-text-stroke-color': 'white',
        'text-align': 'center',
        'word-wrap': 'break-word',
        'overflow-wrap': 'break-word',
        'white-space': 'noraml' // https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
    };

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        private memeStyleService: MemeStyleService,
    ) {
        this.state = StylePopoverPage.initialState;
        this.initialiseSelectionsState();
        // Notify of initial state:
        this.onChange();
    };

    public close() {
        this.viewCtrl.dismiss();
    }

    public closeAndReflow() {
        this.viewCtrl.dismiss();
        setTimeout(
            () => this.onChange()
        );

    }

    public onChange() {
        console.log('reflow');
        this.memeStyleService.set( this.selections2state() );
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
        console.log('state:', newState);
        return newState;
    }
}

import { MemeStyleService } from './../../services/MemeStyleService';
import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'stylepopover.html'
})
export class StylePopoverPage {
    public selections = {};
    private state = {};
    public static initialState = {
        'text-align': 'center',
        'word-wrap': 'break-word',
        'overflow-wrap': 'break-word',
        'white-space': 'noraml' // https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
    };

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        private MemeStyleService: MemeStyleService,
    ) {
        this.state = StylePopoverPage.initialState;
        this.initialiseSelectionsState();
        // Notify of initial state:
        this.onChange();
    };

    close() {
        this.viewCtrl.dismiss();
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
                console.log('input rule', rule, this.state[rule]);
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
                console.log('output rule', rule, this.selections[rule]);
                newState[rule] = this.selections[rule];
            }
        }
        return newState;
    }

    public onChange() {
        let newState = this.selections2state();
        this.MemeStyleService.set( newState );
    }
}

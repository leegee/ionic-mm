import { MemeStyleService } from './../../services/MemeStyleService';
import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'style-popover.html'
})
export class StylePopoverPage {
    public static statePossibleKeys = [
        '-webkit-text-stroke-width',
        '-webkit-text-stroke-color',
        'text-align',
        'word-wrap',
        'overflow-wrap',
        'white-space'
    ];
    public selections = {};
    private state = {};

    constructor(
        public viewCtrl: ViewController,
        private memeStyleService: MemeStyleService,
        public navParams: NavParams
    ) {
        // TODO Make options:
        this.state = {
            '-webkit-text-stroke-width': '0',
            '-webkit-text-stroke-color': 'white',
            'text-align': 'center',
            'word-wrap': 'break-word',
            'overflow-wrap': 'break-word',
            'white-space': 'noraml' // https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
        };
        this.initialiseSelectionsState();
        // Notify of initial state:
        this.onChange();
    };

    public close(submit:boolean) {
        console.log('close');
        this.viewCtrl.dismiss(submit? this.state : null );
    }

    public closeAndReflow() {
        console.log('close and reflow');
        this.viewCtrl.dismiss(this.state);
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
}

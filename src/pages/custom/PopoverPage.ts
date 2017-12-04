import { MemeStyleService } from './../../services/MemeStyleService';
import { Component, EventEmitter, Output } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'popover.html'
})
export class PopoverPage {
    public selections: {} = {};
    private state: {};

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams,
        private MemeStyleService: MemeStyleService,
    ) {
        this.state = this.navParams.get('state');
        this.state2selections();
    };

    close() {
        this.viewCtrl.dismiss();
    }

    private state2selections() {
        for (let rule in this.state) {
            if (rule === 'word-wrap' || rule === 'overflow-wrap') {
                this.selections[rule] = this.state[rule] === 'break-word'? true : false;
            }
        }
    }

    private selections2state() {
        let newState = {};
        for (let rule in this.selections) {
            if (rule === 'word-wrap' || rule === 'overflow-wrap') {
                newState[rule] = this.selections[rule] ? 'break-word' : 'normal';
            }
        }
        return newState;
    }

    public onChange() {
        this.MemeStyleService.set(
            this.selections2state()
        );
    }
}

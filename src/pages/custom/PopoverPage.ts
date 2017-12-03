import { MemeStyleService } from './../../services/MemeStyleService';
import { Component, EventEmitter, Output } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'popover.html'
})
export class PopoverPage {

    _selections = { wordWrapBreakWord: true };

    constructor(
        public viewCtrl: ViewController,
        private MemeStyleService: MemeStyleService
    ) { }

    close() {
        this.viewCtrl.dismiss();
    }

    // Cheaper than ngDoCheck/etc.
    public changed(rule) {
        if (rule === 'wordWrap') {
            console.log('Call MemeStyleService.set');
            this.MemeStyleService.set(
                {
                    style: {
                        wordWrap: this._selections.wordWrapBreakWord ? 'break-word' : 'normal'
                    }
                }
            );
        }

        else {
            console.warn('Unknown switch, ', rule);
        }
    }
}
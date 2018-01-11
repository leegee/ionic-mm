import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/*
 * Handle the state of user-chosen styles.
 *
 * RX Subscriptions: https://angular.io/guide/component-interaction#!#bidirectional-service
 */

@Injectable()
export class MemeStyleService {
    private changeSource = new Subject();
    public changeAnnounced$ = this.changeSource.asObservable();
    private _state = {};

    constructor() { }

    public set(model) {
        this._state = Object.assign(
            this._state,
            model
        );
        this.changeSource.next( this._state );
    }
}


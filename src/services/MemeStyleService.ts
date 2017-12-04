import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/*
 * Handle the state of user-chosen styles.
 *
 * A singleton for the whole meme, covering all text blocks.
 *
 * RX Subscriptions: https://angular.io/guide/component-interaction#!#bidirectional-service
 */

@Injectable()
export class MemeStyleService {

    private changeSource = new Subject();
    public changeAnnounced$ = this.changeSource.asObservable();

    private static _defaultState = {};

    private _state = MemeStyleService._defaultState;

    constructor() { }

    public set(model) {
        console.log('EditableStyleService.set ', model);
        this._state = Object.assign(
            this._state,
            model
        );
        this.changeSource.next( this._state );
    }
}


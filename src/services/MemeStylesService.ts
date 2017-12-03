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

    private static _defaultSettings = {
        style: {
            wordWrap: 'break-word'
        }
    };

    private _settings = MemeStyleService._defaultSettings;

    constructor() { }

    public set(model) {
        console.log('EditableStyleService.set ', model);
        this._settings = Object.assign(
            this._settings,
            model
        );
        this.changeSource.next( this._settings );
    }
}


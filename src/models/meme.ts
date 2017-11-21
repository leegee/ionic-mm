import { TextBlockComponent } from './../components/text-block/text-block';
import { Events } from 'ionic-angular';

export class Meme {
    public id: string;
    public name: string;
    public imageUrl: string;
    public thumbnailUrl: string;
    public width: number;
    public height: number;
    public textBlocks: TextBlockComponent[];
    constructor() {
    }

    public subscribeToLifecycleEvents(events: Events) {
        events.subscribe('create:loaded', this.onViewLoaded);
    };

    public onViewLoaded() {
        console.log('meme ready');
    }

    public setAnchor(
        x:number,
        y:number,
        text?:string
    ) { }
};



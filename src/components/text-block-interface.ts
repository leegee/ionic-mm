export abstract class TextBlockInterface {
    isHidden: boolean;
    id: string;
    abstract sizeText(): void;
    abstract render({});
    abstract getText(): string;
    abstract getStyles(): {};
    abstract setPosition(x:number, y:number): void;
}
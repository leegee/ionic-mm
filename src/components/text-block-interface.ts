export abstract class TextBlockInterface {
    abstract render({});
        // nativeElement:HTMLElement,
        // ctx: CanvasRenderingContext2D,
        // width: number,
        // height: number
        // disaplyedWidth: number
        // displayedHeight: number
    abstract getText(): string;
    abstract getStyles(): {};
    abstract sizeText(): void;
}
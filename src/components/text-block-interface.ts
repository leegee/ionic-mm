export abstract class TextBlockInterface {
    abstract render(
        nativeElement:HTMLElement,
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number
    );
    abstract getText(): string;
    abstract getStyles(): {};
}
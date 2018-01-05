export class Screenshot {
    private canvas: HTMLCanvasElement;;
    public img: HTMLImageElement;
    constructor(
        public document: Document
    ) { }

    getImg() {
        let img: HTMLImageElement = document.getElementById('meme-img') as HTMLImageElement;
        this.canvas = document.createElement("canvas");
        this.canvas.id = "screenshot-canvas";
        document.body.appendChild(this.canvas);

        let ctx = this.canvas.getContext("2d");
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        this.img = document.createElement('img');
        this.img.src = this.canvas.toDataURL();

        return this.img;
    }

}
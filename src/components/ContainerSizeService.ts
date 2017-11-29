import { Injectable } from '@angular/core';

// @see https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions

@Injectable()
export class ContainerSizeService {
    constructor() { }

    static getRenderedSize(cWidth, cHeight, width, height, pos) {
        let oRatio = width / height,
            cRatio = cWidth / cHeight;
        return function () {
            if (oRatio > cRatio) {
                this.width = cWidth;
                this.height = cWidth / oRatio;
            } else {
                this.width = cHeight * oRatio;
                this.height = cHeight;
            }
            this.left = (cWidth - this.width) * (pos / 100);
            this.right = this.width + this.left;
            return this;
        }.call({});
    }

    static getImgSizeInfo(img) {
        let pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
        return ContainerSizeService.getRenderedSize(
            img.width,
            img.height,
            img.naturalWidth,
            img.naturalHeight,
            parseInt(pos[0]));
    }

    public containerSizeFromImg(img: HTMLImageElement, container: HTMLElement) {
        let renderedImg = ContainerSizeService.getImgSizeInfo(img);
        // this.scale = {
        //   x: renderedImg.width / DogePage.width,
        //   y: renderedImg.height / DogePage.height
        // };

        return { width: renderedImg.width + 'px', height: renderedImg.height + 'px'};
        // this.container.style.width = renderedImg.width + 'px';
        // this.container.style.height = renderedImg.height + 'px';
    }
}
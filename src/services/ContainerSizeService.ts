import { Injectable } from '@angular/core';

/*
 * Return the actual displayed size of an image.
 * @see https://stackoverflow.com/questions/37256745/object-fit-get-resulting-dimensions
 */

@Injectable()
export class ContainerSizeService {
    constructor() { }

    static getRenderedSize(
        cWidth: number, cHeight: number,
        width: number, height: number
    ) {
        // console.log('E:', cWidth, cHeight, width, height);
        let oRatio = width / height;
        let cRatio = cWidth / cHeight;
        // console.log('1: ', oRatio, cRatio);
        return function () {
            if (oRatio > cRatio) {
                // console.log('2: ', cWidth, oRatio);
                this.width = cWidth;
                this.height = cWidth / oRatio;
            } else {
                // console.log('3: ', cHeight, oRatio);
                this.width = cHeight * oRatio;
                this.height = cHeight;
            }
            return this;
        }.call({});
    }

    public size(img: HTMLImageElement) {
        let renderedImg = ContainerSizeService.getRenderedSize(
            img.width,
            img.height,
            img.naturalWidth,
            img.naturalHeight
        );
        // console.log(
        //     img.width,
        //     img.height,
        //     img.naturalWidth,
        //     img.naturalHeight
        // );

        return Number(renderedImg.width) ? {
            width: renderedImg.width,
            height: renderedImg.height,
            widthNumber: renderedImg.width,
            heightNumber: renderedImg.height
        } : {
                width: null,
                height: null,
                widthNumber: null,
                heightNumber: null
            };
    }
}
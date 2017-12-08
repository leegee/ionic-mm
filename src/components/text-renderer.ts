import { ElementRef } from '@angular/core';
import { TextBlockInterface } from "./text-block-interface";

export class TextRenderer {
    private nativeElement: HTMLElement;
    private static textStyleRules = ['textAlign', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'position', 'left', 'top', 'bottom', 'right'];
    static reFontSize = /^([.\d]+)\s*([%\w]+)?/;

    public getText() {
        throw new Error('Sub-class did not implement getText()');
    }

    public getStyles() : {} {
        throw new Error('Sub-class did not implement getStyles()');
    }

    protected final = {
        width: <number> null,
        height: <number> null
    };

    public render(
        nativeElement : HTMLElement,
        ctx : CanvasRenderingContext2D,
        width : number,
        height : number
    ) {
        this.final = {width, height};
        this.nativeElement = nativeElement;
        let blockStyles: { [key: string]: string } = this._getStyles();
        let fontSize = this._scaleFont(blockStyles.fontSize);
        ctx.font = [
            blockStyles.fontWeight || '',
            fontSize + 'px',
            blockStyles.fontFamily || ''
        ].join(' ');

        // Centered text
        if (blockStyles.textAlign === 'start') {
            ctx.textAlign = 'center';
            if (blockStyles.left !== 'auto') {
                console.error("Only supports full width");

            }
        }

        ctx.textBaseline = 'top';
        ctx.fillStyle = blockStyles.color;

        this._renderLines(ctx, this.getText(), fontSize, blockStyles);
    }

    private _renderLines(ctx, textToRender, fontSize, blockStyles) {
        let stroke = false;
        if (blockStyles['-webkit-text-stroke-color']
            && blockStyles['-webkit-text-stroke-width']
            && Number(blockStyles['-webkit-text-stroke-width']) > 0
        ) {
            ctx.lineWidth = Number(blockStyles['-webkit-text-stroke-width']);
            ctx.strokeStyle = blockStyles['-webkit-text-stroke-color'];
            stroke = true;
        }

        let lineHeight = this._getScaledLineHeight(blockStyles, fontSize);

        let x = this._scaleImgSide(blockStyles.left, 'width');
        let y = this._scaleImgSide(blockStyles.top, 'height');

        textToRender.split(/[\n\r\f]/g).forEach((text) => {
            console.info('[%s] at %s, %s', text, x, y);
            ctx.fillText(text, x, y);
            if (stroke) {
                ctx.strokeText(text, x, y);
            }
            y += lineHeight;
        });
    }

    // The computed value of 'line-height' varies by user-agent :(
    private _getScaledLineHeight(blockStyles, scaledFontSize): number {
        let el = document.createElement('div');
        let styleAttr = 'position: "absolute";left: 0;top: 0; '
            + 'font-size:' + blockStyles.fontSize + ';'
            + 'line-height: ' + blockStyles.lineHeight;

        el.setAttribute('style', styleAttr);
        el.innerHTML = 'jgyl/t"(';
        this.nativeElement.appendChild(el);
        let cssValue = el.getBoundingClientRect().height;
        el.outerHTML = '';

        return this._scaleFont(cssValue + 'px');
    }

    private _getStyles = () => {
        let textBlockStyle = this.getStyles();
        let styles: { [key: string]: string } = Object.keys(textBlockStyle)
            .filter(ruleName => TextRenderer.textStyleRules.some(
                wanted => ruleName === wanted && textBlockStyle[ruleName] !== ''
            )
            ).reduce((styles, ruleName) => {
                styles[ruleName] = textBlockStyle[ruleName];
                return styles;
            }, {}
            );
        return styles;
    };

    private _scaleImgSide(cssValue: string, side: string): number {
        let rv, value, units;
        if (cssValue.match(/^(auto|normal)$/)) {
            rv = 0; // this.shareImg[side]; Change the keyword value before we get here?
        } else {
            [, value, units] = cssValue.match(TextRenderer.reFontSize);
            if (units === 'px') {
                rv = Number(value) * (this.final[side] / this.final[side]);
            } else {
                console.error('Now only expecting px, got [%s]', units);
                console.trace();
                debugger;
            }
        }
        console.log(side, ':', this.final[side], ', ', cssValue, value, 'v (rv)', rv);
        return rv;
    }

    private _scaleFont(cssValue: string): number {
        console.info('FONT ', cssValue);
        return this._scaleImgSide(cssValue, 'height');
    }


}
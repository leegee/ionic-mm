import { ElementRef } from '@angular/core';
import { TextBlockInterface } from "./text-block-interface";

interface renderArgs {
    nativeElement: HTMLElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    displayedWidth: number;
    displayedHeight: number;
};

export class TextRenderer {
    private static textStyleRules = [
        'textAlign',
        'width',
        'color',
        'fontSize',
        'fontFamily',
        'fontWeight',
        'lineHeight',
        'position',
        'left',
        'top',
        'bottom',
        'right'
    ];
    private static reFontSize = /^([.\d]+)\s*([%\w]+)?/;
    private ctx: CanvasRenderingContext2D;
    private nativeElement: HTMLElement;

    protected computedStyles: { [key: string]: string };
    protected canvas = {
        width: <number>null,
        height: <number>null
    };
    protected displayed = {
        width: <number>null,
        height: <number>null
    };

    public getText(): string {
        throw new Error('Sub-class did not implement getText()');
    }

    public getStyles(): {} {
        throw new Error('Sub-class did not implement getStyles()');
    }

    private _scale(cssValue: string, side: string): number {
        console.log('_scale ', cssValue, side);
        let rv, value, units;
        if (cssValue.match(/^(auto|normal)$/)) {
            rv = 0; // this.shareImg[side]; Change the keyword value before we get here?
        } else {
            [, value, units] = cssValue.match(TextRenderer.reFontSize);
            if (typeof units === 'undefined' || units === 'px') {
                rv = Number(value) * (this.canvas[side] / this.displayed[side]);
            } else {
                console.error('Now only expecting px, got [%s]', units);
                console.trace();
                debugger;
            }
        }
        console.log('RV ', rv);
        return rv;
    }

    private _scaleFont(cssValue: string): number {
        return this._scale(cssValue, 'height');
    }

    public render(args: renderArgs) {
        this.ctx = args.ctx;
        this.nativeElement = args.nativeElement;
        this.canvas = {
            width: args.width,
            height: args.height
        };
        this.displayed = {
            width: args.displayedWidth,
            height: args.displayedHeight
        };

        console.log('RENDER', args);

        this.computedStyles = this._getStyles();
        let fontSize = this._scaleFont(this.computedStyles.fontSize);
        this.ctx.font = [
            this.computedStyles.fontWeight || '',
            fontSize + 'px',
            this.computedStyles.fontFamily || ''
        ].join(' ');

        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = this.computedStyles.color;

        let stroke = false;
        if (this.computedStyles['-webkit-text-stroke-color']
            && this.computedStyles['-webkit-text-stroke-width']
            && Number(this.computedStyles['-webkit-text-stroke-width']) > 0
        ) {
            this.ctx.lineWidth = Number(this.computedStyles['-webkit-text-stroke-width']);
            this.ctx.strokeStyle = this.computedStyles['-webkit-text-stroke-color'];
            stroke = true;
        }

        let lineHeight = this._getScaledLineHeight(fontSize);

        let x = this._scale(this.computedStyles.left, 'width');
        let y = this._scale(this.computedStyles.top, 'height');
        let initalx = x;

        console.log('textAlign: ', this.computedStyles.textAlign);

        this.getText().split(/[\n\r\f]/g).forEach((text) => {
            if (this.computedStyles.textAlign !== 'left'
                && this.computedStyles.textAlign !== 'right'
            ) {
                console.log('textAlign x pre: ', x);
                x = initalx + (this._scale(this.computedStyles.width, 'width') / 2) - (this.ctx.measureText(text).width / 2);
                console.log('textAlign x post: ', x);
            }

            console.info('[%s] at %s, %s', text, x, y);
            this.ctx.fillText(text, x, y);
            if (stroke) {
                this.ctx.strokeText(text, x, y);
            }
            y += lineHeight;
        });
    }

    // The computed value of 'line-height' varies by user-agent :(
    private _getScaledLineHeight(scaledFontSize): number {
        let el = document.createElement('div');
        let styleAttr = 'position: "absolute";left: 0;top: 0; '
            + 'font-size:' + this.computedStyles.fontSize + ';'
            + 'line-height: ' + this.computedStyles.lineHeight;

        el.setAttribute('style', styleAttr);
        el.innerHTML = 'jgyl/t"(';
        this.nativeElement.appendChild(el);
        let cssValue = el.getBoundingClientRect().height;
        el.outerHTML = '';

        console.log('preliminary line-height', cssValue);
        let rv = this._scaleFont(cssValue + 'px');
        console.log('rv line-height', rv);
        return rv;
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

        // Centered text
        if (styles.width === 'auto') {
            styles.width = this.displayed.width.toString();
            styles.height = this.displayed.height.toString();
        }

        return styles;
    };
}




  // ctx.shadowColor = “red” // string Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
  // ctx.shadowOffsetX = 0; // integer Horizontal distance of the shadow, in relation to the text.
  // ctx.shadowOffsetY = 0; // integer Vertical distance of the shadow, in relation to the text.
  // ctx.shadowBlur = 10; // integer

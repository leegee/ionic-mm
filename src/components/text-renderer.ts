export interface TextRendererOptions {
    nativeElement: HTMLElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    displayedWidth: number;
    displayedHeight: number;
};

export class TextRenderer {
    private static textStyleRules = [
        '-webkit-text-stroke',
        '-webkit-text-stroke-color',
        '-webkit-text-stroke-width',
        '-webkitTextStroke',
        '-webkitTextStrokeColor',
        '-webkitTextStrokeWidth',
        'background',
        'backgroundColor',
        'bottom',
        'color',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'height',
        'left',
        'lineHeight',
        'position',
        'right',
        'textAlign',
        'top',
        'width',
    ];
    // ctx.shadowColor = “red” // string Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
    // ctx.shadowOffsetX = 0; // integer Horizontal distance of the shadow, in relation to the text.
    // ctx.shadowOffsetY = 0; // integer Vertical distance of the shadow, in relation to the text.
    // ctx.shadowBlur = 10; // integer

    private static reFontSize = /^([.\d]+)\s*([%\w]+)?/;
    private ctx: CanvasRenderingContext2D;
    private nativeElement: HTMLElement;
    private lineHeight: number;
    private x: number;
    private y: number;
    private initalx: number;
    private nComputedStylesWidthScaled: number;
    private stroke: boolean = false;

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
        // console.log('_scale ', cssValue, side);
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
        // console.log('RV ', rv);
        return rv;
    }

    private _scaleFont(cssValue: string): number {
        return this._scale(cssValue, 'height');
    }

    private _getStyles = () => {
        let textBlockStyle = this.getStyles();
        let styles: { [key: string]: string } = {};

        TextRenderer.textStyleRules.forEach(ruleName => {
            if (textBlockStyle.hasOwnProperty(ruleName) && textBlockStyle[ruleName] !== '') {
                styles[ruleName] = textBlockStyle[ruleName];
            }
        });

        // Canvas rules only:
        if (!styles.textAlign.match(/(left|right|center)/)) {
            console.log('styles.textAlign was ', styles.textAlign);
            styles.textAlign = 'left';
        }

        if (styles.width === 'auto') {
            styles.width = this.displayed.width.toString();
        }
        if (styles.height === 'auto') {
            styles.height = this.displayed.height.toString();
        }

        // Extrapolate from short-hand colour:
        if (styles['-webkit-text-stroke']) {
            [, styles['-webkit-text-stroke-width'], styles['-webkit-text-stroke-color']] =
                styles['-webkit-text-stroke'].match(/^-webkit-text-stroke\s*:\s*(\S+)\s+(\S+)/);
        }

        return styles;
    };

    // The computed value of 'line-height' varies by user-agent :(
    private _setScaledLineHeight(scaledFontSize): void {
        let el = document.createElement('div');
        let fontStyleAttr = 'z-index: 999; display:inline-block; position: "absolute";left: 0;top: 0; width:auto;height:auto; background:blue;'
            + 'font-size:' + this.computedStyles.fontSize + ';'
            + 'line-height: ' + this.computedStyles.lineHeight;

        el.setAttribute('style', fontStyleAttr);
        el.innerHTML = "&nbsp;";
        this.nativeElement.appendChild(el);
        let cssValue = el.getBoundingClientRect().height;
        this.lineHeight = this._scaleFont(cssValue + 'px');
        // console.log('Set line-height to [%s] from [%s]', this.lineHeight, fontStyleAttr);
        el.outerHTML = '';
    }

    public render(args: TextRendererOptions) {
        let allText: string = this.getText();
        if (allText.match(/^\s*$/)) {
            console.warn('Nothing to render');
            return;
        }
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

        if (this.computedStyles['-webkit-text-stroke-color']
            && this.computedStyles['-webkit-text-stroke-width']
            && parseFloat(this.computedStyles['-webkit-text-stroke-width']) > 0
        ) {
            this.ctx.lineWidth = parseFloat(this.computedStyles['-webkit-text-stroke-width']);
            if (this.ctx.lineWidth < 2) {
                this.ctx.lineWidth = 2;
            }
            this.ctx.strokeStyle = this.computedStyles['-webkit-text-stroke-color'];
            this.stroke = true;
        }

        this._setScaledLineHeight(fontSize);

        this.x = this._scale(this.computedStyles.left, 'width');
        this.y = this._scale(this.computedStyles.top, 'height');
        this.initalx = this.x;

        let [, strComputedStylesWidth,] = this.computedStyles.width.match(TextRenderer.reFontSize);
        this.nComputedStylesWidthScaled = this._scale(strComputedStylesWidth, 'width');

        {
            let width = this.nComputedStylesWidthScaled;
            let [, heightStr] = this.computedStyles.height.match(TextRenderer.reFontSize);
            let height: number = this._scale(heightStr, 'height');
            this.ctx.beginPath();
            [this.ctx.fillStyle, this.ctx.globalAlpha] = this.convertColor(this.computedStyles.backgroundColor);
            console.log('this.ctx.globalAlpha', this.ctx.globalAlpha, 'from', this.computedStyles.backgroundColor);
            this.ctx.fillRect(this.x, this.y, width, height);
            this.ctx.fill();
        }

        this.ctx.fillStyle = this.computedStyles.color;
        this.ctx.globalAlpha = 1;

        allText.split(/[\n\r\f]/g).forEach((inputLine) => {
            this.processLine(inputLine);
        });

        console.log('now y = ', this.y);
    }

    processLine(inputLine: string) {
        let renderText = '';
        if (this.nComputedStylesWidthScaled === 0) {
            console.log('Zero-wdith text');
            renderText = inputLine;
        }

        else {
            let inputChars = inputLine.split('');
            let letter, renderLineWidth;
            while (letter = inputChars.shift()) {
                renderText += letter;
                renderLineWidth = this.ctx.measureText(renderText).width;
                if (renderLineWidth >= this.nComputedStylesWidthScaled
                    && inputChars.length
                ) {
                    // console.log(' Fits: %d vs %d', this.ctx.measureText(renderText).width, this.nComputedStylesWidthScaled);
                    renderText = renderText.replace(/\s$/, '');
                    let [, lastWord] = renderText.match(/(\S+)$/);
                    renderText = renderText.replace(/(\S+)$/, '');
                    // console.log('Last word cut [%s]', lastWord);
                    // console.log('- leaves render text [%s]', renderText);
                    lastWord.split('').reverse().forEach(lastWordChar => {
                        inputChars.unshift(lastWordChar);
                        // console.log('-- add [%s] to todo-stack, making [%s]', lastWordChar, inputChars);
                    });
                    this.renderLine(renderText);
                    renderText = '';
                }
            }
        }

        this.renderLine(renderText);
        renderText = '';
    }

    renderLine(renderText: string) {
        renderText = renderText.replace(/\s$/, '');

        // Centre?
        if (this.computedStyles.textAlign === 'center') {
            this.x = this.initalx + (this.nComputedStylesWidthScaled / 2) - (this.ctx.measureText(renderText).width / 2);
        }

        console.log('RENDER LINE [%s] at %s, %s', renderText, this.x, this.y);
        this.ctx.fillText(renderText, this.x, this.y);
        if (this.stroke) {
            this.ctx.strokeText(renderText, this.x, this.y);
        }

        this.y += this.lineHeight;
    }

    hasScrollbars(el: HTMLElement): boolean {
        el.style['::-webkit-scrollbar'] = 'display: block;'

        let rv = (el.scrollWidth > el.offsetWidth)
            || (el.scrollWidth > el.clientWidth)
            || (el.scrollHeight > el.offsetHeight)
            || (el.scrollHeight > el.clientHeight);

        el.style['::-webkit-scrollbar'] = 'display: none;'
        return rv;
    };

    convertColor(rgba): [string, number] {
        console.log('convertColor', rgba);
        const [, r, g, b, , a] = rgba.match(/^rgba?\(([.\d]+),\s*([.\d]+),\s*([.\d]+)(,\s*([.\d]+)?)?\)$/);
        let alpha = 1;
        console.log('rgba', r, g, b, a);
        console.log(Math.abs(Number(1 - a)));
        alpha = a || alpha;
        return [
            '#' + this.decimal2hex(r) + this.decimal2hex(g) + this.decimal2hex(b),
            alpha
        ];
    }

    decimal2hex(dec): string {
        let rv = Number(dec).toString(16);
        if (rv.length === 1) {
            rv = '0' + rv;
        }
        return rv;
    }
}





import * as PIXI from 'pixi.js'

import SoftgamesScene from './SoftgamesScene';

export class EmojiTextStyle extends PIXI.TextStyle {
    public styleID: number = 0;
    public a() {

    }
}
let textMetrices: TextMetrics[] = []
let lines: number[] = []
let aWidth: number[] = []
import { ObjectsPool } from './utils';
let spritePool = new ObjectsPool((baseTexture: any) => {

    return new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 1, 1)))
}, 10000)

console.log("spritePool", spritePool)

/*
let emojiTags: { [name: string]: number } = {
    "<:)>":12
};
*/
class EmojiText extends PIXI.Sprite {

    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public dirty: boolean = true;
    protected _text: string;
    protected _font: string = "";
    protected _style: EmojiTextStyle;
    public localStyleID: number = -1;
    protected baseTexture: PIXI.BaseTexture | undefined = undefined

    constructor(text: string, style: EmojiTextStyle) {
        super()
        this._text = text;
        this._style = style
        this.canvas = document.createElement("canvas")
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    }


    public updateText() {
        if (!this.dirty) return


        if (this.baseTexture === undefined) {
            this.baseTexture = new PIXI.BaseTexture(this.canvas)
        }
        const fontString = this._font
        const ctx = this.context;
        this.context.font = fontString
        const style = this._style;
        const fontSize = style.fontSize as number


        let totalWidth = 0;
        let text = this._text;
        console.log(text)
        let rgx = new RegExp("\<[\\s\\S]*?\>", "g")

        const emojis = text.match(rgx)
        let emojs = []

        if (emojis) {
            console.log(emojis)
            emojis.forEach((e: string, i) => {
                emojs[i] = e
                text = text.replace(e, " " + e + " ")
            })

        }
        const words = text.trim().split(' ');


        textMetrices.length = 0;
        let lp = 0;// fontSize * 0.25;
        let i = 0

        let childCount = this.children.length;
        for (i = 0; i < childCount; i++) {
            spritePool.free(this.removeChildAt(0));
        };


        let textMetric;
        let wp = fontSize * 0.25;

        words.forEach((word: string, i) => {


            words[i] = word
            textMetric = ctx.measureText(word);
            textMetrices[i] = textMetric;

            aWidth[i] = Math.abs(textMetric.actualBoundingBoxLeft) + Math.abs(textMetric.actualBoundingBoxRight) + lp;
            totalWidth += aWidth[i] + wp;
        });


        this.canvas.width = totalWidth;
        this.canvas.height = fontSize;

        ctx.textBaseline = "alphabetic";
        let x = 0
        let y = fontSize * 0.5;
        let cp
        ctx.font = fontString;

        let xx = 0;
        let yy = 0;
        lines.length = 0;

        ctx.fillStyle = "#ffffff"




        words.forEach((word, i) => {
            let _aWidth = aWidth[i]
            textMetric = textMetrices[i];
            wp = fontSize * 0.25
            if (rgx.test(word)) {
                wp = 0
                _aWidth = 0
            }
            else {
                ctx.fillText(word, x + lp * 0.5, y + (textMetric.actualBoundingBoxAscent * 0.5) - 4);

            }
            if (wp > 0) {
                cp = spritePool.get(this.baseTexture) as PIXI.Sprite
                const cpFrame = cp.texture.frame

                cpFrame.x = x;
                cpFrame.y = 0;
                cpFrame.width = aWidth[i];
                cpFrame.height = fontSize;
                if (style.wordWrap) {
                    if (xx + (_aWidth + wp) > style.wordWrapWidth) {
                        lines[lines.length] = xx;
                        xx = 0;
                        yy += fontSize;
                    }
                    //  cp.lineIndex = lines.length;
                    cp.y = yy;
                    cp.x = (xx + (_aWidth * 0.5));
                }
                else {
                    cp.y = 0;
                    cp.x = (xx + (_aWidth * 0.5)) - this.canvas.width * 0.5;
                }
                cp.anchor.set(0.5);
                this.addChild(cp);
            }

            x += _aWidth + wp;
            xx += _aWidth + wp;
        });

        this.baseTexture.setRealSize(this.canvas.width, this.canvas.height)


        this.baseTexture.update();



        childCount = this.children.length;
        let alignAdjust = 0;

        if (style.align === "center") {
            alignAdjust = 0.5;
        }
        else if (style.align === "Right") {
            alignAdjust = 1;
        }
        for (i = 0; i < childCount; i++) {
            cp = this.children[i] as PIXI.Sprite;
            if (style.wordWrap) {
                cp.y += ((fontSize * 0.5));
                cp.x += ((style.wordWrapWidth - lines[i]) * alignAdjust);
            }

            cp.texture.updateUvs()

        }


        this.dirty = false;
    }

    protected _render(renderer: PIXI.Renderer): void {

        if (this.localStyleID !== this._style.styleID) {
            this._font = this._style.toFontString()
            this.localStyleID = this._style.styleID
            this.dirty = true;
        }
        this.updateText();

        super._render(renderer);
    }

    get text(): string {
        return this._text;
    }

    set text(text: string) {
        text = String(text === null || text === undefined ? '' : text);

        if (this._text === text) {
            return;
        }
        this._text = text;
        this.dirty = true;
    }
}

export default class EmojiTextScene extends SoftgamesScene {

    public textConatiner = new PIXI.Sprite()
    public text1 = new EmojiText("hello<;)>sdff there A<:)>SIF<gg> this is", new EmojiTextStyle({
        fontSize: 32,
        wordWrap: false,
        wordWrapWidth: 100

    }))
    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {
        this.addChild(this.textConatiner)

        this.textConatiner.addChild(this.text1)
    }

    public update(timeDelta: number) {
        //  this.text1.text = "T" + this.engine.currentFps

    }
    public resize(width: number, height: number) {
        super.resize(width, height)
        this.textConatiner.x = (width / 2) - (this.textConatiner.width / 2)
        this.textConatiner.y = (height / 2) - (this.textConatiner.height / 2)



    }
}
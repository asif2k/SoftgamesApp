import * as PIXI from 'pixi.js'
import SoftgamesScene from './SoftgamesScene';
import { EasingsFunc } from './PIXIAppEngine';

class CardSprite extends PIXI.Sprite {
    public animTime: number = 0;
    public startAnim: number = 0;
    public zIndex: number = 0
}

class CardsDeckScene extends SoftgamesScene {
    public cardsConatiner = new PIXI.Sprite()
    public cards: CardSprite[] = []
    public cardsHeight: number = 0;
    public cardsAnimationWidth: number = 200;
    public cardAnimationCount: number = 0;
    public direction: number = 1
    public clock: number = 0

    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

        this.addChild(this.cardsConatiner)
        const cardsTextures = resources.cardsTextures?.texture as PIXI.Texture
        let textWidth = cardsTextures.width

        let textHeight = cardsTextures.height
        let cardWidth = textWidth / 13;
        let cardHeight = textHeight / 5
        let x = 0;
        let y = 0;


        for (let i = 0; i < 144; i++) {
            const card = new CardSprite(new PIXI.Texture(cardsTextures.baseTexture, new PIXI.Rectangle(x + 1, y + 1, cardWidth - 2, cardHeight - 2)))


            x += cardWidth;
            if (x >= textWidth - cardWidth) {
                x = 0;
                y += cardHeight;
            }

            if (y >= textHeight - cardHeight) {
                x = 0;
                y = 0
            }
            card.y = i * (cardHeight * 0.03);
            this.cardsHeight = Math.max(this.cardsHeight, card.y)
            card.anchor.set(0.5)
            this.cardsConatiner.addChild(card)
            this.cards.push(card)
        }


        this.cardsConatiner.anchor.set(0.5)
    }

    public init(loader: PIXI.Loader) {
        loader.add('cardsTextures', 'images/cards-textures.png')
    }

    public activated(direction?: number) {
        this.clock = 0
        this.direction = 1;
        if (direction !== undefined) this.direction = direction
        this.cardAnimationCount = 0;
        this.cards.forEach((card, i) => {
            if (this.direction < 0) {
                card.startAnim = i
            }
            else {
                this.cardsConatiner.addChildAt(card, i)
                card.startAnim = (this.cards.length - i)
            }

            //
            card.animTime = 0
            card.zIndex = -1
        })
    }
    public update(timeDelta: number) {
        //return
        let card;
        let animationDuration = 2;
        let animTime = 0;
        let zIndex = 0;
        let infinityCount = 0;
        for (let i = 0; i < this.cards.length; i++) {
            card = this.cards[i]
            if (card.startAnim < this.clock) {
                animTime = card.animTime / animationDuration

                card.x = (((this.cardsAnimationWidth * 2) * EasingsFunc.CubicOut(animTime)) - this.cardsAnimationWidth) * this.direction


                card.animTime += timeDelta
                if (animTime > 0.5 && card.zIndex < zIndex) {
                    card.zIndex = zIndex
                    if (this.direction < 0) {
                        this.cardsConatiner.addChildAt(card, i)
                    }
                    else {
                        this.cardsConatiner.addChildAt(card, this.cards.length - i)
                    }

                }
                if (animTime >= 1) {
                    card.startAnim = Infinity
                    card.x = this.cardsAnimationWidth * this.direction;
                }
            }
            else {
                if (card.startAnim < Infinity) {
                    card.x = -this.cardsAnimationWidth * this.direction;
                }
                else {
                    infinityCount++
                    card.x = this.cardsAnimationWidth * this.direction;
                }


            }
            zIndex++
        }

        this.clock += timeDelta

        if (infinityCount === this.cards.length) {
            console.log("time to flip direction")

            this.activated(-this.direction)
        }
    }

    public resize(width: number, height: number) {
        super.resize(width, height)
        this.cardsConatiner.x = (width / 2);
        this.cardsConatiner.y = (height / 2) - (this.cardsHeight / 2)


        this.cardsAnimationWidth = (width * 0.35)
        const scale = (height - 50) / (this.cardsHeight * 2);
        this.cardsConatiner.scale.set(scale, scale)
        this.cardsAnimationWidth /= scale

    }
}

export default CardsDeckScene
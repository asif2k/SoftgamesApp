
import * as PIXI from 'pixi.js'


import { AppEngine, TextMenuScene } from './PIXIAppEngine';


import CardsDeckScene from './CardsDeck';
import EmojiTextScene from './EmojiText';


export default class SoftgamesApp extends AppEngine {
    constructor(container: HTMLElement) {
        super(container);
        console.log(this);

    }
    public launch() {

        this.setRequiredFps(60)

        const fpsDisplay = document.createElement('div')
        fpsDisplay.style.position = "absolute";
        fpsDisplay.style.left = "10px";
        fpsDisplay.style.top = "10px";
        fpsDisplay.style.color = "#ffffff";


        this.container.appendChild(fpsDisplay)


        const menu = new TextMenuScene(this);

        const returnToMenu = () => {
            this.setActiveScene("menu")
        }
        const loader = new PIXI.Loader()
        const cardsDeckScene = new CardsDeckScene(this, returnToMenu)
        const emojiTextScene = new EmojiTextScene(this, returnToMenu)



        cardsDeckScene.init(loader);
        emojiTextScene.init(loader);


        menu.add("CARDS DECK", () => {
            this.setActiveScene("cards-deck");
        })

        menu.add("EMOJI TEXT", () => {
            this.setActiveScene("emoji-text");
        })

        menu.add("FIRE EFFECT", () => {

        })



        this.addScene("menu", menu);
        this.addScene("cards-deck", cardsDeckScene)
        this.addScene("emoji-text", emojiTextScene)

        this.setActiveScene("menu")



        window.addEventListener("resize", () => { this.resize() })
        loader.load((loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {


            cardsDeckScene.build(resources)
            cardsDeckScene.resize(this.renderer.width, this.renderer.height)

            emojiTextScene.build(resources)
            emojiTextScene.resize(this.renderer.width, this.renderer.height)

            this.start(() => {

            })

            setInterval(() => {
                fpsDisplay.innerHTML = `${this.currentFps} fps`
            }, 200)


        })


    }
}





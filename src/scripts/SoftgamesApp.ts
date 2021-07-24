
import * as PIXI from 'pixi.js'


import { AppEngine, TextMenuScene } from './PIXIAppEngine';


import CardsDeckScene from './CardsDeck';


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
        const cardsDeck = new CardsDeckScene(this, returnToMenu)



        cardsDeck.init(loader);


        menu.add("CARDS DECK", () => {
            this.setActiveScene("cards-deck");
        })

        menu.add("EMOJI TEXT", () => {

        })

        menu.add("FIRE EFFECT", () => {

        })



        this.addScene("menu", menu);
        this.addScene("cards-deck", cardsDeck)

        this.setActiveScene("menu")



        window.addEventListener("resize", () => { this.resize() })
        loader.load((loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {


            cardsDeck.build(resources)
            cardsDeck.resize(this.renderer.width, this.renderer.height)
            this.start(() => {

            })

            setInterval(() => {
                fpsDisplay.innerHTML = `${this.currentFps} fps`
            }, 200)


        })


    }
}





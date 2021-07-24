import * as PIXI from 'pixi.js'

export class Scene extends PIXI.Container {
    public engine: AppEngine
    public constructor(engine: AppEngine) {
        super()
        this.engine = engine
    }
    public activated() {

    }
    public update(timeDelta: number) {
    }
    public resize(width: number, height: number) {
    }

}




export class ScenesManager {
    public scenes = new Map<string, Scene>()

    constructor() {

    }

    public add(name: string, scene: Scene): Scene {
        this.scenes.set(name, scene)
        console.log(scene)
        return (scene)
    }
}

export class AppEngine {

    public loader: PIXI.Loader;
    public renderer: PIXI.Renderer;
    public container: HTMLElement
    public scenesManager = new ScenesManager();
    public currentScene: Scene | undefined = undefined

    private requiredTimeDelta: number = 1 / 60
    public currentFps = 0
    constructor(container: HTMLElement) {

        this.container = container
        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({ width: 100, height: 100, antialias: true });




        container.appendChild(this.renderer.view);

        setTimeout(() => {
            this.resize();
        }, 10);
        this.setRequiredFps(120)
    }

    public setRequiredFps(fps: number) {
        this.requiredTimeDelta = 1 / fps
    }
    public addScene(name: string, scene: Scene): Scene {
        this.scenesManager.add(name, scene)
        scene.resize(this.renderer.width, this.renderer.height)
        return scene;
    }
    public setActiveScene(name: string) {
        this.currentScene = this.scenesManager.scenes.get(name)
        this.currentScene?.resize(this.renderer.width, this.renderer.height)
        this.currentScene?.activated()
    }
    public resize() {
        const rect = this.renderer.view.getBoundingClientRect()
        this.renderer.resize(rect.width, rect.height)
        this.scenesManager.scenes.forEach(scene => {
            scene.resize(rect.width, rect.height)
        })
    }

    public start(render: (timeDelta: number) => void) {

        let currentTime = performance.now() * 0.001;
        let lastTime = currentTime
        let lastFpsTime = currentTime
        let currentTimeDelta = 0
        let fpsCounter = 0;
        const tick = () => {

            currentTime = performance.now() * 0.001;
            currentTimeDelta = currentTime - lastTime;
            //console.log(currentTimeDelta, this.requiredTimeDelta)
            if (currentTimeDelta < this.requiredTimeDelta) {
                return
            }
            if (currentTime - lastFpsTime > 1) {
                this.currentFps = fpsCounter;
                lastFpsTime = currentTime - ((currentTime - lastFpsTime) % this.requiredTimeDelta);
                fpsCounter = 0;
            }
            fpsCounter++;


            render(currentTimeDelta)
            if (this.currentScene) {
                this.currentScene.update(currentTimeDelta)
                this.renderer.render(this.currentScene)
            }
            lastTime = currentTime - (currentTimeDelta % this.requiredTimeDelta);

        }

        const step1 = () => {
            tick()
            requestAnimationFrame(step2);
        }
        const step2 = () => {
            tick()
            requestAnimationFrame(step1);
        }

        requestAnimationFrame(step1);
    }

} // Engine




export class TextButton extends PIXI.Text {
    static labelStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    });
    constructor(label: string, onClick: () => void) {
        super(label, TextButton.labelStyle)
        this.interactive = true
        this.buttonMode = true
        this.anchor.set(0.5)

        this.on('pointerover', () => {
            this.tint = 0xFF0000;
        })

        this.on('click', () => {
            onClick();
        })

        this.on('pointerout', () => {
            this.tint = 0xFFFFFF;
        })


    }
}


export class TextMenuScene extends Scene {
    public buttons = new PIXI.Sprite()
    constructor(engine: AppEngine) {
        super(engine)

        this.addChild(this.buttons)
        this.buttons.anchor.set(0.5);


    }
    public resize(width: number, height: number) {
        this.buttons.x = (width / 2) - (this.buttons.width / 2)
        this.buttons.y = (height / 2) - (this.buttons.height / 2)

    }
    public add(label: string, onClick: () => void): PIXI.Sprite {
        const button = new TextButton(label, onClick)
        button.y = this.buttons.children.length * 60
        this.buttons.addChild(button)
        return button;
    }
}

export const EasingsFunc = {
    "Linear": function (t: number) {
        return t
    },
    "BounceIn": function (t: number) {
        return 1 - EasingsFunc.BounceOut(1 - t);
    },
    "BounceOut": function (t: number) {
        if (t < (1 / 2.75)) { return 7.5625 * t * t; }
        else if (t < (2 / 2.75)) { return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75; }
        else if (t < (2.5 / 2.75)) { return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375; }
        else { return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375; }
    },
    "BackOut": function (t: number) {
        return --t * t * ((1.70158 + 1) * t + 1.70158) + 1;
    },

    "CubicOut": function (t: number) {
        return (--t) * t * t + 1;
    },
}
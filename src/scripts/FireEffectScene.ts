import * as PIXI from 'pixi.js'


import SoftgamesScene from './SoftgamesScene';
import { ObjectsPool } from './utils';



class ParticleSprite extends PIXI.Sprite {
    public age: number = 0
    public time: number = 0
    public life: number = 0
    public velX: number = 0;
    public velY: number = 0;
    public gravity: number = 0;
    public lifeDecay: number = 0.1;
    public spin: number = 0;
    public pScale: number = 0;


}

/*
interface ParticleEmitRequest {
    time: number;
    life: number;
    age: number;
    velX: number;
    velY: number;
    lifeDecay: number;
    spin: number;
    pScale: number;

}
class TinyParticleSystem extends PIXI.Sprite {

    public particleTextures: PIXI.Texture[] = []
    public spritePool: ObjectsPool;
    public emitRequestsPool: ObjectsPool;
    public allEmitRequests: ParticleEmitRequest[] = []

    public clock: number = 0;

    constructor(textureSheet: PIXI.Texture, particleWidth: number, particleHeight: number, maxSprites: number = 10) {
        super()

        this.emitRequestsPool = new ObjectsPool(() => {
            const req: ParticleEmitRequest = {
                age: 1,
                time: 0,
                life: 0,
                velX: 0,
                velY: 0,
                lifeDecay: 0.01,
                spin: 0,
                pScale: 0
            }
            this.allEmitRequests[this.allEmitRequests.length] = req;

            return req


        }, 1000);

        this.spritePool = new ObjectsPool(() => {
            const spr = new ParticleSprite();
            this.addChild(spr);
            spr.visible = false;
            return spr;

        }, maxSprites)

        for (let y = 0; y < textureSheet.baseTexture.height; y += particleHeight) {
            for (let x = 0; x < textureSheet.baseTexture.width; x += particleWidth) {
                this.particleTextures.push(new PIXI.Texture(textureSheet.baseTexture, new PIXI.Rectangle(x, y, particleWidth, particleHeight)))
            }
        }

    }

    public emitParticle(request: Partial<ParticleEmitRequest>) {
        const req = this.emitRequestsPool.get() as ParticleEmitRequest;
        Object.assign(req, request)
        req.time += this.clock;
        req.life = req.age

    }
    public update(timeDelta: number) {
        let req;
        let spr;
        for (let i = 0; i < this.allEmitRequests.length; i++) {
            req = this.allEmitRequests[i]
            if (req.life > 0 && req.time < this.clock) {
                spr = this.spritePool.get() as ParticleSprite
                if (spr) {
                    Object.assign(spr, req)
                    spr.x = 0;
                    spr.y = 0;
                    spr.life = spr.age
                    req.life = -1;
                    spr.alpha = 1;
                    spr.texture = this.particleTextures[1]
                    this.emitRequestsPool.free(req)
                    spr.visible = true;

                }
            }

        }

        let decay = 0;
        for (let i = 0; i < this.children.length; i++) {
            spr = this.children[i] as ParticleSprite

            if (spr.visible) {

                spr.x += spr.velX
                spr.y += spr.velY;
                spr.life -= spr.lifeDecay
                decay = spr.life / spr.age;

                if (spr.life < 0) {
                    this.spritePool.free(spr);
                    spr.visible = false
                } else {
                    spr.alpha = decay;

                    spr.texture = this.particleTextures[Math.floor((this.particleTextures.length - 1) * (1 - decay))]
                }
            }

        }
        this.clock += timeDelta;
    }

}

*/
class SimpleParticleSystem extends PIXI.Sprite {

    public particleTextures: PIXI.Texture[] = []
    public spritePool: ObjectsPool;
    public clock: number = 0;
    constructor(textureSheet: PIXI.Texture, particleWidth: number, particleHeight: number, maxSprites: number = 10) {
        super()


        this.spritePool = new ObjectsPool(() => {
            const spr = new ParticleSprite();
            this.addChild(spr);
            spr.visible = false;
            spr.anchor.set(0.5)
            return spr;

        }, maxSprites)

        for (let y = 0; y < textureSheet.baseTexture.height; y += particleHeight) {
            for (let x = 0; x < textureSheet.baseTexture.width; x += particleWidth) {
                this.particleTextures.push(new PIXI.Texture(textureSheet.baseTexture, new PIXI.Rectangle(x, y, particleWidth, particleHeight)))
            }
        }

    }

    public update(timeDelta: number) {
        let spr;


        let decay = 0;
        for (let i = 0; i < this.children.length; i++) {
            spr = this.children[i] as ParticleSprite

            if (spr.visible) {
                spr.x += spr.velX
                spr.y += spr.velY;
                spr.velY += spr.gravity
                spr.life -= spr.lifeDecay
                decay = spr.life / spr.age;


                if (spr.life < 0) {
                    this.spritePool.free(spr);
                    spr.visible = false
                } else {
                    spr.alpha = decay;
                    spr.texture = this.particleTextures[Math.floor((this.particleTextures.length - 1) * (1 - decay))];

                }

            }

        }

        this.clock += timeDelta
    }

}

class FireParticleSystem extends SimpleParticleSystem {
    public lastClock: number = 0;
    public update(timeDelta: number) {

        if (this.clock - this.lastClock > 0.25) {
            const spr = this.spritePool.get() as ParticleSprite
            if (spr) {
                spr.age = 3;
                spr.life = spr.age;
                spr.velX = (Math.random() - 0.5) * 1;
                spr.velY = -1;
                spr.gravity = 0;

                spr.lifeDecay = 0.03;
                spr.visible = true
                spr.x = 0;
                spr.y = 0;
            }

            this.lastClock = this.clock;
        }




        super.update(timeDelta)
    }
}



const fireFilter = new PIXI.Filter(`
precision mediump float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform float frameTime;
varying vec2 vTextureCoord;

varying vec2 vTextureCoordAnim;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;

    vTextureCoordAnim=aTextureCoord;
    vTextureCoordAnim.y -= fract(frameTime * 0.001 * 0.2);	
    vTextureCoordAnim.x -= fract(frameTime * 0.001 * 0.05);
    
}
`,
    `
    precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D distortion;
uniform float frameTime;
varying vec2 vTextureCoordAnim;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){ return a + b*cos( 6.28318*(c*t+d) ); }
	
	

void main(void)
{
    
    

    vec4 d = texture2D(distortion,vTextureCoord);
		vec4 d1 = d * 0.2;					//between 0 : 1
		vec4 d2 = (d * 2.0 - 1.0) * 0.2;	//between -1 : 1
        float grad = mix(2.0, 0.0, vTextureCoord.y + 0.45);
        vec4 n = texture2D(uSampler, vTextureCoordAnim.xy);
        //n += grad;
gl_FragColor =n;

}
    `
    , {
        frameTime: 0.0,
    });


export default class FireEffectScene extends SoftgamesScene {


    public clock: number = 0
    public fireContainer = new PIXI.Sprite()

    public fireParticleSystem: FireParticleSystem;
    public activated() {
        this.clock = 0
    }
    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {
        this.addChild(this.fireContainer)
        /*
        const noiseTexture = resources.noise?.texture as PIXI.Texture
        const distortionTexture = resources.distortion?.texture as PIXI.Texture

        noiseTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        
        fireFilter.uniforms.distortion = distortionTexture

        const sprite = new PIXI.Sprite(noiseTexture)
        sprite.filters = [fireFilter]
        sprite.anchor.set(0.5)

        this.fireContainer.addChild(sprite)
        */

        this.fireParticleSystem = new FireParticleSystem(resources.fire?.texture as PIXI.Texture, 64, 64)
        this.fireContainer.addChild(this.fireParticleSystem)

        this.fireParticleSystem.scale.set(2, 2)
        console.log(this.fireParticleSystem)
    }

    public init(loader: PIXI.Loader) {
        loader.add('noise', 'images/noise.jpg')
        loader.add('distortion', 'images/distortion.jpg')

        loader.add('fire', 'images/particle-fire.png');
    }
    public update(timeDelta: number) {
        fireFilter.uniforms.frameTime = this.clock;

        this.fireContainer.x = (this.engine.renderer.width / 2) - (this.fireContainer.width / 2)
        this.fireContainer.y = (this.engine.renderer.height / 2) - (this.fireContainer.height / 2)

        this.clock += timeDelta;
        this.fireParticleSystem.update(timeDelta)

    }

}
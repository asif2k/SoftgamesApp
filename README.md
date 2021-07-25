
## Job Test Application Project

Application is a collection of three part that are

### Card Deck Demo

#### Requirements
Create 144 sprites (NOT graphics object) that are stacked on each other like cards in a deck(so object above covers bottom one, but not completely). Every second 1 object from top of stack goes to other stack - animation of moving should be 2 seconds long. So at the end of whole process you should have reversed stack. Display number of fps in left top corner and make sure, that this demo runs well on mobile devices.
#### Implementation
Implemented using a texture sheet of 52 cards images that are used to create 144 sprites , cards animation in update function of scene , if all cards are animation then it switch the direction, for better performance of render texture atlas is used because otherwise rendering 144 different sprite would need to 144 different textures and for rendering each sprite there will be texture change call to webgl and expensive operation , infact texture atlas is widely used in this application to gain the performance and easiness of design, animation is handled using easing functions and some maths but it can also be implemented using a small keyframe animation system , this way we can animate cards in more fancy way , but that require more time to implement 



### Emoji Text

#### Requirements
Create a tool that will allow mixed text and images in an easy way (for example displaying text with emoticons or prices with money icon). It should come up every 2 seconds a random text with images in random configuration (image + text + image, image + image + image, image + image + text, text + image + text etc) and a random font size.


#### Implementation
Developed a simple class to manage different instances of text and images and are stored using object pools to reuse images/sprite objects, with object pooling we do not create new sprite/images whenever we need to render new type of text combination.
Implemented using a simple tags based text system , which parse text in tags and render images in between text , it also change text color and size using tags so we can create many different kind of text combination , with this we can also implement animated emojis , because emojis are simple sprites that can be extended to animated sprites



### Fire Effect

#### Requirements
Particles - make a demo that shows an awesome fire effect. Please keep number of images low (max 10 sprites on screen at once). Feel free to use existing libraries how you would use them in a real project.


#### Implementation
In order for max performance and with the limited number of sprites instead of using third party libray on which we cannot control number of sprites on screen ,  a small particle system is implemeted with max number of sprite support, particle system works with a texture sheet (texture atlas) and animate texture on sprites depend upon remaining life of particle, with this system and simple fire partical system is created with provided fire texture sheet, we can also extend this particle system to be more robust and advanced with more features but using more different kind of partical emitters and style of particle animation




[Application Demo](https://asif2k.github.io/portfolio/softgames/)
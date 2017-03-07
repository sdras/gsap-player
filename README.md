# 📽 GSAP Player 📽

A small, customizable YouTube-like player for GSAP (GreenSock) Timelines 

Project Demo Page: [http://s.codepen.io/sdras/debug/Mpjxxq/](http://s.codepen.io/sdras/debug/Mpjxxq/)

![GSAP Player](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/gsap-preview.png "Such a player")

## Usage

The simplest possible use is loading gsap-player.js before the closing body tag (you do not need the CSS file) and implementing:

```gsapPlayer({ playerTL: yourtimelinehere });```

This will append the player to document.body. The default timeline name is `tl`, if you're using tl, you only need to call `gsapPlayer();`

## Configurations

### Light Theme

![Light Theme](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/lighttheme.png "Light Theme")

GSAP Player will default to a dark theme, but you can also configure a light theme:

```gsapPlayer({ light: true });```

### Position

By default, the GSAP player will be 80% wide and 40px from the bottom of the viewport. You can configure it to be full-width or flush to the bottom, or slightly higher or lower. Bottom must be in a string.

```
gsapPlayer({
  fullWidth: true,
  bottom: '0'
});
```

If you use full-width and keep the container defaulted to document.body, you should be sure that you've either used a reset or placed `margin: 0 ` on the body due to strange browser defaults.

### Container

By default, the player is instantiated on the body, but if you'd like to change the parent, you can do:

```gsapPlayer({ container: '#foo' });```

You'll need to put position: relative on that containing element to enclose the player spacially in that div. Just a heads up: this won't put the animation in the container as well (the configuration is kept separate for flexibility. 

## License

(The MIT License)

Copyright (c)2017 Sarah Drasner [@sarah_edo](https://twitter.com/sarah_edo) All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


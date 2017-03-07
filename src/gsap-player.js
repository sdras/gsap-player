var injectGsapPlayerStyle = (function(style){
  return function(){
    if ( !style ) { return; }
    document.head.insertAdjacentHTML('afterbegin','<style type="text/css">'+style+'</style>');
    style = null;
  }
})('#gsap-player input[type=range]{-webkit-appearance:none;width:100%;margin:5px 0}#gsap-player input[type=range]:focus{outline:0}#gsap-player input[type=range]::-webkit-slider-runnable-track{width:100%;height:9px;cursor:pointer;background:#7e7e7e;border-radius:1px}#gsap-player input[type=range]::-webkit-slider-thumb{box-shadow:.6px .6px 2.1px rgba(0,0,0,.15),0 0 .6px rgba(13,13,13,.15);border:1px solid #bbb;height:18px;width:19px;border-radius:100px;background:#7e7e7e;cursor:pointer;-webkit-appearance:none;margin-top:-5.6px}#gsap-player input[type=range]:focus::-webkit-slider-runnable-track{background:#8b8b8b}#gsap-player input[type=range]::-moz-range-track{width:100%;height:9px;cursor:pointer;background:#7e7e7e;border-radius:1px}#gsap-player input[type=range]::-moz-range-thumb{box-shadow:.6px .6px 2.1px rgba(0,0,0,.15),0 0 .6px rgba(13,13,13,.15);border:1px solid #a0a0a0;height:18px;width:19px;border-radius:100px;background:#7e7e7e;cursor:pointer}#gsap-player input[type=range]::-ms-track{width:100%;height:9px;cursor:pointer;background:0 0;border-color:transparent;color:transparent}#gsap-player input[type=range]::-ms-fill-lower{background:#717171;border:1.1px solid #6e6e6e;border-radius:2px;box-shadow:.9px .9px 1.7px transparent,0 0 .9px rgba(13,13,13,0)}#gsap-player input[type=range]::-ms-fill-upper{background:#7e7e7e;border:1.1px solid #6e6e6e;border-radius:2px;box-shadow:.9px .9px 1.7px transparent,0 0 .9px rgba(13,13,13,0)}#gsap-player input[type=range]::-ms-thumb{box-shadow:.6px .6px 2.1px rgba(0,0,0,.15),0 0 .6px rgba(13,13,13,.15);border:1px solid #a0a0a0;width:19px;border-radius:100px;background:#7e7e7e;cursor:pointer;height:9px}#gsap-player input[type=range]:focus::-ms-fill-lower{background:#7e7e7e}#gsap-player input[type=range]:focus::-ms-fill-upper{background:#8b8b8b}#gsap-player button{background:0 0;border:none;outline:0;cursor:pointer}#gsap-player .loop{margin:0 0 0 10px}#gsap-player{position:fixed;z-index:1000;bottom:40px;background:#000;display:flex;align-items:center;padding:10px;width:80%;margin:0 10%;opacity:.8}#gsap-player .playpause{position:relative;margin:0 0 0 10px}#gsap-player .playpause svg{position:absolute;top:-5px;left:-5px}#gsap-player .playpause .play{opacity:0}#gsap-player button,#gsap-player input{opacity:.8;transition:.2s opacity ease-in;-webkit-transition:.2s opacity ease-in}#gsap-player:hover button,#gsap-player:hover input{opacity:1;transition:.2s opacity ease-out;-webkit-transition:.2s opacity ease-out}#gsap-player .speed-tooltip{display:flex;flex-direction:column;font-size:10px;font-family:helvetica,sans-serif;opacity:0;visibility:hidden;position:absolute;top:-60px;left:32px;padding-top:5px}#gsap-player .speed-tooltip div{margin:2px 10px;opacity:.7;transition:.2s opacity ease-in;-webkit-transition:.2s opacity ease-in;cursor:pointer}#gsap-player .speed-tooltip div:hover{opacity:1;transition:.2s opacity ease-out;-webkit-transition:.2s opacity ease-out}#gsap-player .speed{color:#fff;margin:0 10px 0 5px}');

function gsapPlayer(params) {
  'use strict';
  
  injectGsapPlayerStyle();

  params        = params           === undefined ? {}             : params;
  var bottom    = params.bottom    === undefined ? '40px'         : params.bottom,
      playerTL  = params.playerTL  === undefined ? tl             : params.playerTL,
      container = params.container === undefined ? document.body  : params.container,
      fullWidth = params.fullWidth === undefined ? false          : params.fullWidth,
      light     = params.light     === undefined ? false          : params.light;

  /*------------------------------------------
             helper functions
  -------------------------------------------*/

  //function to set multiple attributes at once
  function setAttributes(el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  //function to create/append children because typing
  function append(type, parent) {
    var el = document.createElement(type);
    parent.appendChild(el);
    return el;
  }

  //create an SVG in the correct namespace, append a path
  function createSVG(parent, vbx, pathData) {
    var el      = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var svgNS   = el.namespaceURI;
    var path    = document.createElementNS(svgNS, 'path');
    parent.appendChild(el);
    el.appendChild(path);
    el.setAttribute('viewBox', vbx);
    path.setAttribute('d', pathData);
    return el;
  }

  /*------------------------------------------
             Create the elements
  -------------------------------------------*/

  var isPlaying = true,
      playerWidth, playerMargin, playerColor, iconColor;
  fullWidth ? playerWidth  = '99%'  : playerWidth  = '80%';
  fullWidth ? playerMargin = '0'    : playerMargin = '0 10%';
  light     ? playerColor  = 'white': playerColor  = 'black';
  light     ? iconColor    = '#333' : iconColor  = '#ddd';

  //gsap player
  if (container !== document.body) { container = document.querySelector(container) }
  var player    = append('div', container); 
  setAttributes(player, {
    'id'   : 'gsap-player',
    'style': 'bottom: ' + bottom + '; background: ' + playerColor + '; width: ' + playerWidth + '; margin: ' + playerMargin,
  });

  //playpause button
  var playpause = append('button', player);
  setAttributes(playpause, {
      'class': 'playpause',
  });

  //play svg
  var play = createSVG(playpause, '0 0 32 32', 'M6 4l20 12L6 28z');
  setAttributes(play, {
    'width' : '15px',
    'height': '15px',
    'class' : 'play', 
    'fill'  :  iconColor, 
  });

  //pause svg
  var pause = createSVG(playpause, '0 0 32 32', 'M4 4h10v24H4zm14 0h10v24H18z');
  setAttributes(pause, {
    'width' : '15px',
    'height': '15px',
    'class' : 'pause', 
    'fill'  :  iconColor, 
  });

  //speed button
  var speed = append('button', player);
      speed.innerHTML = '1x';
  setAttributes(speed, {
      'class': 'speed',
      'style': 'color: ' + iconColor + '; font-size: 12px',
  });

  //speed tooltip
  var sTooltip = append('div', player);
  var tenth    = append('div', sTooltip);
  var half     = append('div', sTooltip);
  var full     = append('div', sTooltip);
  var double   = append('div', sTooltip);
  tenth.innerHTML  = '0.1x';
  half.innerHTML   = '0.5x';
  full.innerHTML   = '1x';
  double.innerHTML = '2x';
  setAttributes(sTooltip, {
    'class' : 'speed-tooltip',
    'style' : 'background: ' + playerColor + '; color: ' + iconColor, 
  });

  //range input
  var slider = append('input', player);
  setAttributes(slider, {
    'type' : 'range',
    'min'  : 0,
    'max'  : 100,
    'value': 0,
    'id'   : 'fader',
    'step' : 0.1,
  });

  //loop button
  var loop    = append('button', player);
  var loopSVG = createSVG(loop, '0 0 32 32', 'M27.802 5.197C24.877 2.003 20.672 0 16 0 7.16 0 0 7.163 0 16h3C3 8.82 8.82 3 16 3c3.843 0 7.297 1.67 9.677 4.322L21 12h11V1l-4.2 4.197zM29 16c0 7.18-5.82 13-13 13-3.844 0-7.298-1.67-9.678-4.322L11 20H0v11l4.197-4.197C7.122 29.997 11.327 32 16 32c8.837 0 16-7.163 16-16h-3z');
  loop.setAttribute('class', 'loop');
  setAttributes(loopSVG, {
    'width' : '15px',
    'height': '15px',
    'fill'  :  iconColor, 
  });

  /*------------------------------------------
          timeline particulars
  -------------------------------------------*/

  playerTL.progress( slider.value / 100 );

  playerTL.eventCallback("onUpdate", function() {
    slider.value = playerTL.progress() * 100;

    if ( !playerTL.isActive() && playerTL.progress(1) ) {
      TweenMax.to(".play", 0.1, {
        opacity: 1
      });
      TweenMax.to(".pause", 0.1, {
        opacity: 0
      });
      isPlaying = false;
    }
  });

  /*------------------------------------------
          event listeners
  -------------------------------------------*/

  slider.addEventListener('input', function() {
    this.setAttribute('value', this.value);
    playerTL.progress( this.value / 100 );
    playerTL.resume();
  });

  speed.addEventListener('click', function() {
    TweenMax.to(".speed-tooltip", 0.2, {
      autoAlpha: 1
    });

    var sToolDiv = document.querySelectorAll('.speed-tooltip div');
    for (var i = 0; i < sToolDiv.length; i++) {
      sToolDiv[i].addEventListener('click', function() {

        var sNum = this.innerHTML;
        speed.innerHTML = sNum;
        sNum = sNum.slice(0, -1);
        playerTL.timeScale(sNum);

        TweenMax.to(".speed-tooltip", 0.2, {
          autoAlpha: 0
        });

      }, false);
    }
  });

  loop.addEventListener('click', function() {
    var loopSVG = this.querySelector('svg');
    TweenMax.fromTo(loopSVG, 0.5, {
      rotation: 0
    }, {
      rotation: 360,
      transformOrigin: '50% 50%',
      ease: Circ.easeOut
    })
    playerTL.progress(0);
    playerTL.restart();

    if (!isPlaying) {
      TweenMax.to(play, 0.1, {
        opacity: 0
      });
      TweenMax.to(pause, 0.1, {
        opacity: 1
      });
      isPlaying = true;
    }
  });

  playpause.addEventListener('click', function() {
    var play =  this.querySelector('svg.play'),
        pause = this.querySelector('svg.pause');

    if (isPlaying === true) {
      TweenMax.to(play, 0.1, {
        opacity: 1
      });
      TweenMax.to(pause, 0.1, {
        opacity: 0
      });

      playerTL.pause();
      isPlaying = false;

    } else {
      TweenMax.to(play, 0.1, {
        opacity: 0
      });
      TweenMax.to(pause, 0.1, {
        opacity: 1
      });

      slider.value == 100 ? playerTL.restart() : playerTL.resume();
      isPlaying = true;
    }
  });

};

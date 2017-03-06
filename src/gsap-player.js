//timeline

var playerTL = new TimelineMax();

playerTL.to(".box", 4, {
	rotation: 360,
	x: 400,
	ease: Bounce.easeInOut
});

//slider

// (function gsapPlayer(params) {
//   params       = params          === undefined ? {}     : params;
//   var bottom   = params.bottom   === undefined ? '40px' : params.bottom,
//   		playerTL = params.playerTL === undefined ? 'tl'   : params.playerTL,
//   		color    = params.color    === undefined ? 'dark' : params.color;

/* todo: 
x change the tl instances to playerTL
x create all the html stuff with JS
- create the color swap
x set up the repo
- set up params/lib properly
- replay switch
*/


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
		var el 			= document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var svgNS 	= el.namespaceURI;
    var path	 	= document.createElementNS(svgNS, 'path');
    parent.appendChild(el);
    el.appendChild(path);
    el.setAttribute('viewBox', vbx);
    path.setAttribute('d', pathData);
    return el;
	}

	/*------------------------------------------
	           Create the elements
	-------------------------------------------*/

	var isPlaying = true;

	//gsap player
	var player = append('div', document.body);
  setAttributes(player, {
    'id'   : 'gsap-player',
    'style': 'bottom: 40px; background: black', //to do, set the params
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
    'fill'  : '#ddd', //to do, set the params
  });

  //pause svg
	var pause = createSVG(playpause, '0 0 32 32', 'M4 4h10v24H4zm14 0h10v24H18z');
  setAttributes(pause, {
    'width' : '15px',
    'height': '15px',
    'class' : 'pause', 
    'fill'  : '#ddd', //to do, set the params
  });

  //speed button
	var speed = append('button', player);
			speed.innerHTML = '1x';
  setAttributes(speed, {
    'class': 'speed',
  });

	//speed tooltip
	var sTooltip = append('div', player);
	var tenth  	 = append('div', sTooltip);
	var half  	 = append('div', sTooltip);
	var full     = append('div', sTooltip);
	var double   = append('div', sTooltip);
	sTooltip.setAttribute('class', 'speed-tooltip');
	tenth.innerHTML  = '0.1x';
	half.innerHTML   = '0.5x';
	full.innerHTML   = '1x';
	double.innerHTML = '2x';

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
	var loop 		= append('button', player);
	var loopSVG = createSVG(loop, '0 0 32 32', 'M27.802 5.197C24.877 2.003 20.672 0 16 0 7.16 0 0 7.163 0 16h3C3 8.82 8.82 3 16 3c3.843 0 7.297 1.67 9.677 4.322L21 12h11V1l-4.2 4.197zM29 16c0 7.18-5.82 13-13 13-3.844 0-7.298-1.67-9.678-4.322L11 20H0v11l4.197-4.197C7.122 29.997 11.327 32 16 32c8.837 0 16-7.163 16-16h-3z');
  loop.setAttribute('class', 'loop');
  setAttributes(loopSVG, {
    'width' : '15px',
    'height': '15px',
    'fill'  : '#ddd', //to do, set the params
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
	});

	playpause.addEventListener('click', function() {
		var play = 	this.querySelector('svg.play'),
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


// })();
/**
 * author: pel
 */
;~function(global) {
	'use strict';
	var Game = {};
	global['Game'] = Game;

	/*==================
	 * util functions
	 *==================*/
	/**
	 * extends base with obj
	 * @param base the target object
	 * @param obj a simple object
	 */
	function ext(base, obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				base[key] = obj[key]
			}
		}
		return base;
	}

	function defineClass(constructor, prototype, superClass) {
		var cz = function() {
			superClass && superClass.apply(this, arguments);
			constructor && constructor.apply(this, arguments);
		};
		prototype = ext(superClass ? new superClass() : {}, prototype);
		prototype.constructor = cz;
		cz.prototype = prototype;
		return cz;
	}

	function loadImage(inMap, onload) {
		var outMap = {}
		var keyArr = [];
		for (var key in inMap) {
			keyArr.push(key);
		}

		var loading = 0;

		var doLoadImage = function(keyArr) {
			if (keyArr.length == 0) {
				setTimeout(function() {
					onload(outMap);
				}, 0);
				return;
			}
			var len = Math.min(5, keyArr.length);
			var nextArr = keyArr.slice(len);
			var next = function() {
				if (--loading == 0) {
					doLoadImage(nextArr);
				}
			}
			loading += len;
			for (var i = 0; i < len; ++i) {
				key = keyArr[i];
				var url = inMap[key];
				var img = new Image();
				outMap[key] = img;
				img.onload = next;
				img.src = url;
			}
		}

		doLoadImage(keyArr);
	}

	function roundRect(context, x, y, w, h, r) {
		if (w < 2 * r) r = w * 0.5;
		if (h < 2 * r) r = h * 0.5;
		context.beginPath();
		context.moveTo(x+r, y);
		context.arcTo(x+w, y,   x+w, y+h, r);
		context.arcTo(x+w, y+h, x,   y+h, r);
		context.arcTo(x,   y+h, x,   y,   r);
		context.arcTo(x,   y,   x+w, y,   r);
		context.closePath();
	}

	function clearNode($node) {
		while ($node.hasChildNodes()) {
			$node.removeChild($node.lastChild);
		}
	}

	var customEvents = {};
	function onEvent(e, fn) {
		var fns = customEvents[e] || (customEvents[e] = []);
		if (fns.indexOf(fn) == -1) {
			fns.push(fn);
		}
	}
	function offEvent(e, fn) {
		var fns = customEvents[e];
		var index;
		if (fns && (index = fns.indexOf(fn)) != -1) {
			fns.splice(index, 1);
		}
	}
	function fireEvent(e) {
		var fns = customEvents[e];
		if (fns) {
			var args = [].slice.call(arguments, 1);
			for (var i = 0, len = fns.length; i < len; ++i) {
				fns[i].apply(Game, args);
			}
		}
	}

	/**
	 * constant
	 */
	var MARGIN_TOP = 30;
	var STAGE_WIDTH = 360, STAGE_HEIGHT = 480 + MARGIN_TOP;
	var FLOOR_WIDTH = 100, FLOOR_HEIGHT = 12, FLOOR_DISTANCE = 60;
	var SPRING_HEIGHT = FLOOR_HEIGHT - 4;
	var HERO_WIDTH = 26;
	var ARROW_HEIGHT = 15, ARROW_WIDTH = 5; // 钉子尺寸

	//var FLOOR_VELOCITY_BASE = -0.10; // 地板上升速度
	var FLOOR_VELOCITY_BASE = -0.05; // 地板上升速度
	var GRAVITY_ACC = 0.0015; // 重力加速度
	var SPRINGING_VELOCITY = -0.5; // 离开弹簧时的初速度
	var SPRING_TIME = 100; // 弹簧压缩时间
	var FAKE_FLOOR_TIME = 300, FAKE_FLOOR_TIME2 = 600; // 虚踏板的停留时间, 虚踏板的转动时间
	var ROLLING_VELOCITY = 0.1; // 传送带速度
	var CONTROL_VELOCITY = 0.2; // 左右操作的速度
	var MAX_ACTION_INTERVAL = 20;


	/**
	 * var
	 */
	var floorArray, hero;
	var $wrap, $canvas, $ctx, $res;
	var lastTime;
	var drawCountStartTime = 0, drawCount = 0, lastInterval = 0, lastDrawCount = 0;
	var floorVelocity;
	var score, bestScore = 0, level;
	var isRunning = false, isCooldownTime = false;
	var leftPressed = NaN, rightPressed = NaN, spacePressed = NaN;
	var topBarChange = false;
	// var timeCoefficient = 1, timeModifier = 0;

	var FloorSeq = function() {
		var _seq = 0;
		var _running = false;
		return {
			start : function() {
				_running = true;
			},
			get : function() {
				if (!_running) {
					return 0;
				}
				return _seq++;
			},
			reset: function() {
				_seq = 0;
				_running = false;
			}
		};
	}();

	/**
	 * class define
	 */
	var Floor = defineClass(function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.seq = FloorSeq.get();
	}, {
		draw : function(context) {
			context.save();
			context.translate(this.x, this.y);
			context.lineWidth = FLOOR_HEIGHT;
			//make it solid 
			context.setLineDash([23.5, 0.]);
			//context.setLineDash([this.width, 0.]);
			
			context.strokeStyle = this.color;
			
			context.beginPath();
			context.moveTo(0, -FLOOR_HEIGHT * 0.5);
			context.lineTo(FLOOR_WIDTH, -FLOOR_HEIGHT * 0.5);
			//context.lineTo(this.width, -FLOOR_HEIGHT * 0.5);
			context.stroke();
			
			/*
			context.fillStyle = this.color;
			context.fillRect(0, 0, this.width, -FLOOR_HEIGHT);
            */
            context.fillStyle = "#000000";
			context.fillText(this.text, 0, 0);
			context.restore();
		},
		getHeight : function() {
			return FLOOR_HEIGHT;
		},
		landing : function(hero, time) {
			hero.vy = floorVelocity;
			hero.regain();
			updateScore(this.seq);
		},
		standing : function(hero, time) {
		},
		leaving : function(hero, time) {
		}
	});

	var SPRING = defineClass(function(x, y) {
		this.spring = SPRING_HEIGHT;
		this.restoring = false;
	}, {
		getHeight : function() {
			return this.spring + 4;
		},
		draw : function(context, time) {
			if (this.restoring) {
				this.restore(time);
			}
			var currentHeight = this.getHeight();
			context.save();
			context.translate(this.x, this.y);
			var originFillStyle = context.fillStyle;

			context.fillRect(0, -2, FLOOR_WIDTH, 2);
			context.fillRect(0, -currentHeight, FLOOR_WIDTH, 2);

			var gap = 10;
			var width = (FLOOR_WIDTH - gap * 4) / 3;
			context.lineWidth = width;
			context.setLineDash([1, 2]);
			context.beginPath();
			var x = gap + width * 0.5;
			context.moveTo(x, -currentHeight + 2);
			context.lineTo(x, -2);
			x += gap + width;
			context.moveTo(x, -currentHeight + 2);
			context.lineTo(x, -2);
			x += gap + width;
			context.moveTo(x, -currentHeight + 2);
			context.lineTo(x, -2);
			context.stroke();
			context.restore();
		},
		landing : function(hero, time) {
			this.touchTime = time;
			this.spring = SPRING_HEIGHT;
			hero.vy = floorVelocity;
			hero.regain();
			updateScore(this.seq);
		},
		standing : function(hero, time) {
			var offset = time - this.touchTime;
			if (offset < SPRING_TIME) {
				this.spring = SPRING_HEIGHT - offset / SPRING_TIME * 5;
			} else if (offset < SPRING_TIME * 2) {
				this.spring = SPRING_HEIGHT - 15 + offset / SPRING_TIME * 10;
			} else {
				hero.vy = SPRINGING_VELOCITY;
				hero.onFloor = null;
				this.leaving(hero, time);
			}
		},
		leaving : function(hero, time) {
			this.leavingTime = time;
			this.restoring = true;
		},
		restore : function(time) {
			var offset = time - this.leavingTime;
			var distance = 5 / SPRING_TIME * offset;
			if (this.spring < SPRING_HEIGHT) {
				this.spring += distance;
				if (this.spring >= SPRING_HEIGHT) {
					this.spring = SPRING_HEIGHT;
					this.restoring = false;
				}
			} else {
				this.spring -= distance;
				if (this.spring <= SPRING_HEIGHT) {
					this.spring = SPRING_HEIGHT;
					this.restoring = false;
				}
			}
		}
	}, Floor);

	var ROLLING_RIGHT = defineClass(function(x, y) {
		this.offset = 20;
	}, {
		draw : function(context) {
			if (--this.offset <0) {
				this.offset = 20;
			}
			context.save();
			context.translate(this.x, this.y);
			context.setLineDash([15, 5]);
			context.lineWidth = 2;
			context.lineDashOffset = this.offset;
			var markX = FLOOR_WIDTH * 0.2;
			var midH = FLOOR_HEIGHT * 0.5;
			// the track
			roundRect(context, 1, -FLOOR_HEIGHT + 1, FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2, midH);
			context.stroke();
			// the arrow
			context.setLineDash([]);
			context.beginPath();
			context.moveTo(markX, -midH - 3);
			context.lineTo(markX + 4, -midH);
			context.lineTo(markX, -midH + 3);
			context.moveTo(markX + 8, -midH - 3);
			context.lineTo(markX + 12, -midH);
			context.lineTo(markX + 8, -midH + 3);
			context.stroke();
			// the bearing
			context.beginPath();
			context.arc(midH, -midH, midH - 3, 0, 2 * Math.PI, false);
			context.arc(FLOOR_WIDTH - midH, -midH, midH - 3, 0, 2 * Math.PI, false);
			context.fill();
			context.restore();
		},
		landing : function(hero, time) {
			hero.vy = floorVelocity;
			hero.vx = ROLLING_VELOCITY;
			hero.regain();
			updateScore(this.seq);
		},
		leaving : function(hero, time) {
			hero.vx = 0;
		}
	}, Floor);

	var ROLLING_LEFT = defineClass(function(x, y) {
		this.offset = 0;
	}, {
		draw : function(context) {
			if (++this.offset >= 20) {
				this.offset = 0;
			}
			context.save();
			context.translate(this.x, this.y);
			context.setLineDash([15, 5]);
			context.lineWidth = 2;
			context.lineDashOffset = this.offset;
			var markX = FLOOR_WIDTH * 0.8;
			var midH = FLOOR_HEIGHT * 0.5;
			// the track
			roundRect(context, 1, -FLOOR_HEIGHT + 1, FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2, midH);
			context.stroke();
			// the arrow
			context.setLineDash([]);
			context.beginPath();
			context.moveTo(markX, -midH - 3);
			context.lineTo(markX - 4, -midH);
			context.lineTo(markX, -midH + 3);
			context.moveTo(markX - 8, -midH - 3);
			context.lineTo(markX - 12, -midH);
			context.lineTo(markX - 8, -midH + 3);
			context.stroke();
			// the bearing
			context.beginPath();
			context.arc(midH, -midH, midH - 3, 0, 2 * Math.PI, false);
			context.arc(FLOOR_WIDTH - midH, -midH, midH - 3, 0, 2 * Math.PI, false);
			context.fill();
			context.restore();
		},
		landing : function(hero, time) {
			hero.vy = floorVelocity;
			hero.vx = -ROLLING_VELOCITY;
			hero.regain();
			updateScore(this.seq);
		},
		leaving : function(hero, time) {
			hero.vx = 0;
		}
	}, Floor);

	var ARROW_FLOOR = defineClass(function(x, y) {
	}, {
		draw : function(context) {
			context.save();
			context.translate(this.x, this.y);
			context.fillRect(0, - this.getHeight(), FLOOR_WIDTH, 3);
			context.fillRect(0, 6 - this.getHeight(), FLOOR_WIDTH, 3);
			context.beginPath();
			var bottom = - this.getHeight() + 0.5;
			var top = bottom - ARROW_HEIGHT;
			var left = 0.5;
			var right = FLOOR_WIDTH - 0.5;
			context.moveTo(left, bottom);
			for (var x = 0; x < right; ) {
				context.lineTo(x += ARROW_WIDTH, top);
				context.lineTo(Math.min(x += ARROW_WIDTH, right), bottom);
			}
			context.closePath();
			context.fillStyle = '#fff';
			context.fill();
			context.stroke();
			context.restore();
		},
		landing : function(hero, time) {
			hero.vy = floorVelocity;
			hero.hurt(4, time);
			updateScore(this.seq);
		}
	}, Floor);

	var FAKE_FLOOR = defineClass(function(x, y) {
		this.height = FLOOR_HEIGHT;
		this.restoring = false;
	}, {
		getHeight : function() {
			return this.height;
		},
		draw : function(context, time) {
			if (this.restoring) {
				this.restore(time);
			}
			context.save();
			context.translate(this.x, this.y);
			if (this.height >= FLOOR_HEIGHT || this.height <= 0) {
				context.fillStyle = '#999';
				context.fillRect(0, -FLOOR_HEIGHT, FLOOR_WIDTH, FLOOR_HEIGHT);
			} else {
				var percent = this.height / FLOOR_HEIGHT;
				var colorInc = Math.round(0x66 * percent);
				var color = 0x33 + colorInc;
				context.fillStyle = 'rgb(' + color +',' + color + ',' + color + ')';
				context.fillRect(0, -this.getHeight(), FLOOR_WIDTH, this.getHeight());
				color = 0x99 + colorInc;
				context.fillStyle = 'rgb(' + color +',' + color + ',' + color + ')';
				context.fillRect(0, -FLOOR_HEIGHT, FLOOR_WIDTH, FLOOR_HEIGHT - this.getHeight());
			}
			context.restore();
		},
		landing : function(hero, time) {
			this.touchTime = time;
			hero.vy = floorVelocity;
			hero.regain();
			updateScore(this.seq);
		},
		standing : function(hero, time) {
			var offset = time - this.touchTime;
			if (offset < FAKE_FLOOR_TIME) {
				this.height = FLOOR_HEIGHT;
			} else if (offset < FAKE_FLOOR_TIME2) {
				this.height = FLOOR_HEIGHT / (FAKE_FLOOR_TIME - FAKE_FLOOR_TIME2) * (offset - FAKE_FLOOR_TIME2);
			} else {
				this.height = 0;
				hero.onFloor = null;
				this.leaving(hero, time);
			}
		},
		leaving : function(hero, time) {
			var offset = time - this.touchTime;
			if (offset >= FAKE_FLOOR_TIME && offset < FAKE_FLOOR_TIME2) {
				this.restoring = true;
			}
		},
		restore : function(time) {
			var offset = time - this.touchTime;
			if (offset < FAKE_FLOOR_TIME2) {
				this.height = FLOOR_HEIGHT / (FAKE_FLOOR_TIME - FAKE_FLOOR_TIME2) * (offset - FAKE_FLOOR_TIME2);
			} else {
				this.height = 0;
				this.restoring = false;
			}
		}
	}, Floor);

	var Hero = defineClass(function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = HERO_WIDTH;
		this.height = HERO_WIDTH;
		this.direction = 0; //left -1， stay 0， right 1
		this.onFloor = null;
		this.vx = 0;
		this.vy = 0;
		this.life = 10;
		this.pos = {
			standing : {
				middle : [2],
				right : [62, 32, 62, 92]
			},
			falling : {
				middle : [122, 152],
				right : [182, 212]
			}
		};
		this.hurtTime = 0;
		this.blinkTime = 0;
		this.blink = false;
		this.frameIndex = 0;
		this.frameTime = 0;
	}, {
		turnLeft : function() {
			if (window.DEBUG) {
				console.log('left');
			}
			this.direction = -1;
		}, 
		turnRight : function() {
			if (window.DEBUG) {
				console.log('right');
			}
			this.direction = 1;
		},
		stay : function() {
			if (window.DEBUG) {
				console.log('stay');
			}
			this.direction = 0;
		},
		draw : function(context, time) {
			context.save();
			if (this.direction < 0) {
				context.scale(-1, 1);
				context.translate(-this.x - this.width, this.y);
			} else {
				context.translate(this.x, this.y);
			}

			if (this.life < 10 && this.hurtTime > 0 && time - this.hurtTime < 1000) {
				if (this.blinkTime < this.hurtTime) {
					this.blink = true;
					this.blinkTime = time;
				} else if (time - this.blinkTime >= 100) {
					this.blink = !this.blink;
					this.blinkTime = time;
				}
			} else if (this.blink) {
				this.blink = false;
			}

			var state = this.onFloor ? this.pos.standing : this.pos.falling;
			var frames = this.direction == 0 ? state.middle : state.right;
			if (time - this.frameTime >= 60) {
				this.frameTime = time;
				++this.frameIndex;
			}
			this.frameIndex = this.frameIndex % frames.length;
			context.drawImage($res.hero,
				frames[this.frameIndex], this.blink ? 32 : 2, 26, 26,
				0, -this.height, this.width, this.height);
			context.restore();
		},
		regain : function() {
			if (this.life < 10) {
				++this.life;
				topBarChange = true;
			}
		},
		hurt : function(num, time) {
			this.hurtTime = time;
			this.life = Math.max(0, this.life - num);
			topBarChange = true;
		}
	});

	/**
	 * action
	 */
	function generateFloor() {

        var deepFloors = [
        {'rect': [311.0, 1077.0, 278.0, 1084.0], 'text': 'Identity_1 [1,266] (Identity)', 'color': '#a4d3ee'} ,
{'rect': [57.0, 1077.0, 25.0, 1084.0], 'text': 'Identity [1,1404] (Identity)', 'color': '#a4d3ee'} ,
{'rect': [319.0, 1064.0, 270.0, 1070.0], 'text': 'model/output_contours/Reshape (Reshape)', 'color': '#d1eeee'} ,
{'rect': [64.0, 1064.0, 18.0, 1070.0], 'text': 'model/output_mesh/Reshape (Reshape)', 'color': '#d1eeee'} ,
{'rect': [320.0, 1050.0, 269.0, 1057.0], 'text': 'model/conv2d_26/BiasAdd (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [67.0, 1050.0, 16.0, 1057.0], 'text': 'model/conv2d_20/BiasAdd (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [312.0, 1036.0, 276.0, 1043.0], 'text': 'model/p_re_lu_24/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [59.0, 1036.0, 23.0, 1043.0], 'text': 'model/p_re_lu_19/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [358.0, 1008.0, 277.0, 1015.0], 'text': 'model/batch_normalization_v1_24/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [105.0, 1008.0, 23.0, 1015.0], 'text': 'model/batch_normalization_v1_19/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [311.0, 1022.0, 278.0, 1029.0], 'text': 'model/add_21/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [353.0, 994.0, 279.0, 1001.0], 'text': 'model/depthwise_conv2d_21/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [164.0, 980.0, 134.0, 987.0], 'text': 'Identity_2 [1,1] (Identity)', 'color': '#a4d3ee'} ,
{'rect': [58.0, 1022.0, 25.0, 1029.0], 'text': 'model/add_17/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [100.0, 994.0, 25.0, 1001.0], 'text': 'model/depthwise_conv2d_17/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [173.0, 966.0, 125.0, 973.0], 'text': 'model/output_faceflag/Reshape (Reshape)', 'color': '#d1eeee'} ,
{'rect': [170.0, 952.0, 128.0, 959.0], 'text': 'model/activation/Sigmoid (Sigmoid)', 'color': '#cd853f'} ,
{'rect': [334.0, 980.0, 252.0, 987.0], 'text': 'model/batch_normalization_v1_23/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [82.0, 980.0, 0.0, 987.0], 'text': 'model/batch_normalization_v1_18/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [311.0, 966.0, 275.0, 973.0], 'text': 'model/p_re_lu_22/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [59.0, 966.0, 23.0, 973.0], 'text': 'model/p_re_lu_17/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [174.0, 938.0, 123.0, 945.0], 'text': 'model/conv2d_30/BiasAdd (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [357.0, 938.0, 275.0, 945.0], 'text': 'model/batch_normalization_v1_22/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [167.0, 924.0, 131.0, 931.0], 'text': 'model/p_re_lu_27/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [105.0, 938.0, 23.0, 945.0], 'text': 'model/batch_normalization_v1_17/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [193.0, 896.0, 111.0, 903.0], 'text': 'model/batch_normalization_v1_27/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [309.0, 952.0, 276.0, 959.0], 'text': 'model/add_20/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [351.0, 924.0, 277.0, 931.0], 'text': 'model/depthwise_conv2d_20/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [57.0, 952.0, 24.0, 959.0], 'text': 'model/add_16/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [99.0, 924.0, 25.0, 931.0], 'text': 'model/depthwise_conv2d_16/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [310.0, 910.0, 274.0, 917.0], 'text': 'model/p_re_lu_21/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [73.0, 910.0, 36.0, 917.0], 'text': 'model/p_re_lu_16/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [310.0, 882.0, 228.0, 889.0], 'text': 'model/batch_normalization_v1_21/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [165.0, 910.0, 132.0, 917.0], 'text': 'model/add_23/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [187.0, 882.0, 113.0, 889.0], 'text': 'model/depthwise_conv2d_23/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [88.0, 882.0, 6.0, 889.0], 'text': 'model/batch_normalization_v1_16/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [308.0, 896.0, 275.0, 903.0], 'text': 'model/add_19/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [308.0, 868.0, 233.0, 875.0], 'text': 'model/depthwise_conv2d_19/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [186.0, 868.0, 104.0, 875.0], 'text': 'model/batch_normalization_v1_26/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [71.0, 896.0, 38.0, 903.0], 'text': 'model/add_15/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [86.0, 868.0, 11.0, 875.0], 'text': 'model/depthwise_conv2d_15/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [297.0, 854.0, 260.0, 861.0], 'text': 'model/p_re_lu_20/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [163.0, 854.0, 127.0, 861.0], 'text': 'model/p_re_lu_25/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [87.0, 854.0, 50.0, 861.0], 'text': 'model/p_re_lu_15/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [325.0, 826.0, 244.0, 833.0], 'text': 'model/batch_normalization_v1_20/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [240.0, 826.0, 159.0, 833.0], 'text': 'model/batch_normalization_v1_25/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [99.0, 826.0, 17.0, 833.0], 'text': 'model/batch_normalization_v1_15/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [295.0, 840.0, 262.0, 847.0], 'text': 'model/add_18/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [161.0, 840.0, 128.0, 847.0], 'text': 'model/add_22/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [85.0, 840.0, 52.0, 847.0], 'text': 'model/add_14/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [316.0, 812.0, 242.0, 819.0], 'text': 'model/depthwise_conv2d_18/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [228.0, 812.0, 153.0, 819.0], 'text': 'model/depthwise_conv2d_22/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [115.0, 812.0, 40.0, 819.0], 'text': 'model/depthwise_conv2d_14/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [155.0, 826.0, 102.0, 833.0], 'text': 'model/max_pooling2d_4/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [173.0, 798.0, 137.0, 805.0], 'text': 'model/p_re_lu_14/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [219.0, 770.0, 138.0, 777.0], 'text': 'model/batch_normalization_v1_14/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [172.0, 784.0, 139.0, 791.0], 'text': 'model/add_13/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [214.0, 756.0, 139.0, 763.0], 'text': 'model/depthwise_conv2d_13/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [172.0, 742.0, 135.0, 749.0], 'text': 'model/p_re_lu_13/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [218.0, 714.0, 136.0, 721.0], 'text': 'model/batch_normalization_v1_13/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [170.0, 728.0, 137.0, 735.0], 'text': 'model/add_12/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [212.0, 700.0, 138.0, 707.0], 'text': 'model/depthwise_conv2d_12/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [170.0, 686.0, 134.0, 693.0], 'text': 'model/p_re_lu_12/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [228.0, 658.0, 146.0, 665.0], 'text': 'model/batch_normalization_v1_12/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [168.0, 672.0, 135.0, 679.0], 'text': 'model/add_11/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [217.0, 644.0, 143.0, 651.0], 'text': 'model/depthwise_conv2d_11/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [143.0, 658.0, 90.0, 665.0], 'text': 'model/max_pooling2d_3/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [170.0, 630.0, 134.0, 637.0], 'text': 'model/p_re_lu_11/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [216.0, 602.0, 134.0, 609.0], 'text': 'model/batch_normalization_v1_11/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [168.0, 616.0, 135.0, 623.0], 'text': 'model/add_10/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [210.0, 588.0, 136.0, 595.0], 'text': 'model/depthwise_conv2d_10/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [168.0, 574.0, 132.0, 581.0], 'text': 'model/p_re_lu_10/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [214.0, 547.0, 133.0, 553.0], 'text': 'model/batch_normalization_v1_10/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [166.0, 560.0, 134.0, 567.0], 'text': 'model/add_9/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [208.0, 533.0, 135.0, 540.0], 'text': 'model/depthwise_conv2d_9/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [165.0, 519.0, 131.0, 526.0], 'text': 'model/p_re_lu_9/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [164.0, 505.0, 132.0, 512.0], 'text': 'model/add_8/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [221.0, 491.0, 141.0, 498.0], 'text': 'model/batch_normalization_v1_9/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [137.0, 491.0, 94.0, 498.0], 'text': 'model/channel_padding_2/Pad (Pad)', 'color': '#d1eeee'} ,
{'rect': [218.0, 477.0, 145.0, 484.0], 'text': 'model/depthwise_conv2d_8/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [141.0, 477.0, 88.0, 484.0], 'text': 'model/max_pooling2d_2/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [165.0, 463.0, 131.0, 470.0], 'text': 'model/p_re_lu_8/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [211.0, 435.0, 131.0, 442.0], 'text': 'model/batch_normalization_v1_8/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [164.0, 449.0, 132.0, 456.0], 'text': 'model/add_7/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [206.0, 421.0, 133.0, 428.0], 'text': 'model/depthwise_conv2d_7/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [164.0, 407.0, 129.0, 414.0], 'text': 'model/p_re_lu_7/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [209.0, 379.0, 129.0, 386.0], 'text': 'model/batch_normalization_v1_7/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [162.0, 393.0, 130.0, 400.0], 'text': 'model/add_6/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [204.0, 365.0, 131.0, 372.0], 'text': 'model/depthwise_conv2d_6/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [162.0, 351.0, 127.0, 358.0], 'text': 'model/p_re_lu_6/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [160.0, 337.0, 129.0, 344.0], 'text': 'model/add_5/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [217.0, 323.0, 137.0, 330.0], 'text': 'model/batch_normalization_v1_6/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [133.0, 323.0, 91.0, 330.0], 'text': 'model/channel_padding_1/Pad (Pad)', 'color': '#d1eeee'} ,
{'rect': [214.0, 309.0, 141.0, 316.0], 'text': 'model/depthwise_conv2d_5/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [138.0, 309.0, 85.0, 316.0], 'text': 'model/max_pooling2d_1/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [162.0, 295.0, 127.0, 302.0], 'text': 'model/p_re_lu_5/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [208.0, 267.0, 127.0, 274.0], 'text': 'model/batch_normalization_v1_5/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [160.0, 281.0, 129.0, 288.0], 'text': 'model/add_4/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [202.0, 253.0, 129.0, 260.0], 'text': 'model/depthwise_conv2d_4/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [160.0, 239.0, 125.0, 246.0], 'text': 'model/p_re_lu_4/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [206.0, 211.0, 125.0, 218.0], 'text': 'model/batch_normalization_v1_4/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [159.0, 225.0, 127.0, 232.0], 'text': 'model/add_3/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [200.0, 197.0, 127.0, 204.0], 'text': 'model/depthwise_conv2d_3/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [158.0, 183.0, 124.0, 190.0], 'text': 'model/p_re_lu_3/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [157.0, 169.0, 125.0, 176.0], 'text': 'model/add_2/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [213.0, 155.0, 133.0, 162.0], 'text': 'model/batch_normalization_v1_3/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [129.0, 155.0, 90.0, 162.0], 'text': 'model/channel_padding/Pad (Pad)', 'color': '#d1eeee'} ,
{'rect': [210.0, 141.0, 137.0, 148.0], 'text': 'model/depthwise_conv2d_2/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [134.0, 141.0, 84.0, 148.0], 'text': 'model/max_pooling2d/MaxPool (MaxPool)', 'color': '#54ff9f'} ,
{'rect': [158.0, 127.0, 124.0, 134.0], 'text': 'model/p_re_lu_2/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [204.0, 99.0, 124.0, 106.0], 'text': 'model/batch_normalization_v1_2/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [157.0, 113.0, 125.0, 120.0], 'text': 'model/add_1/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [199.0, 85.0, 126.0, 92.0], 'text': 'model/depthwise_conv2d_1/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [157.0, 71.0, 122.0, 78.0], 'text': 'model/p_re_lu_1/Relu (Prelu)', 'color': '#cd853f'} ,
{'rect': [202.0, 43.0, 122.0, 50.0], 'text': 'model/batch_normalization_v1_1/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [154.0, 57.0, 125.0, 64.0], 'text': 'model/add/add (AddV2)', 'color': '#ffefd5'} ,
{'rect': [195.0, 29.0, 124.0, 36.0], 'text': 'model/depthwise_conv2d/depthwise (DepthwiseConv2dNative)', 'color': '#54ff9f'} ,
{'rect': [176.0, 16.0, 98.0, 23.0], 'text': 'model/batch_normalization_v1/FusedBatchNormV3 (_FusedConv2D)', 'color': '#54ff9f'} ,
{'rect': [157.0, 2.0, 116.0, 9.0], 'text': 'input_1 [1,192,192,3] (Placeholder)', 'color': '#a4d3ee'} ,
        ];

		var colors = ["#54ff9f","#ffefd5","#ffefd5","#eee9e9"];
		var lastY = 0.
		var firstInit = floorArray.length == 0;
		var floor = floorArray[floorArray.length - 1];
		var postion = floor && floor.y || 0;
		//while (postion < STAGE_HEIGHT) {
		while (deepFloors.length>0) {
			/*
			if (Math.random()*5<=1) {
				postion += 0;
			} else {
				postion += FLOOR_DISTANCE;
			}*/

            var f = deepFloors.pop();
            var texts = f["text"].split("/");
			texts = texts[texts.length-1].split("(");
			


			postion += (f["rect"][1] - lastY)*2;
			lastY = f["rect"][1];

			var width = texts[0].length * 8;
			//console.log(width);
			
			var floorY = postion;
			
			//var floorX = Math.round(Math.random() * STAGE_WIDTH - FLOOR_WIDTH * 0.5);
			var floorX = parseInt(""+f["rect"][0]);
			var floorY = parseInt(""+floorY);

			//console.log(floorX);

			if (firstInit) { // make sure can land on a floor at the beginning
				if (floorY > STAGE_HEIGHT - FLOOR_DISTANCE) {
					FloorSeq.start();
					floorX = (STAGE_WIDTH - FLOOR_WIDTH) * 0.5;
					newFloor = new Floor(floorX, floorY);
					//console.log(floorY);
					newFloor.color = f["color"];
					newFloor.width = width;
					
					newFloor.text = texts[0];
					floorArray.push(newFloor);
					continue;
				}
			}
			var newFloor;
			/*
			var seed = window.DEBUG_FLOOR || Math.random();
			if (seed > 0.5) {
				newFloor = new Floor(floorX, floorY);
			} else if (seed > 0.4) {
				newFloor = new FAKE_FLOOR(floorX, floorY);
			} else if (seed > 0.3) {
				newFloor = new ARROW_FLOOR(floorX, floorY);
			} else if (seed > 0.2) {
				newFloor = new ROLLING_LEFT(floorX, floorY);
			} else if (seed > 0.1) {
				newFloor = new ROLLING_RIGHT(floorX, floorY);
			} else {
				newFloor = new SPRING(floorX, floorY);
			}*/
			newFloor = new Floor(floorX, floorY);
			

			//newFloor.color = colors[Math.floor(Math.random()*4)];
			newFloor.color = f["color"];
            newFloor.width = width;
			newFloor.text = texts[0];

			floorArray.push(newFloor);
		}
	}

	function removeOutboundFloor() {
		var floorIndex, len = floorArray.length;
		for (floorIndex = 0; floorIndex < len; ++floorIndex) {
			var floor = floorArray[floorIndex];
			if (floor.y >= MARGIN_TOP) { // visible
				break;
			}
		}
		if (floorIndex > 0) {
			floorArray.splice(0, floorIndex);
		}
	}

	function updateHeroHorizontalPostion(step, time) {
		var velocity = hero.vx + hero.direction * CONTROL_VELOCITY;
		if (velocity != 0) {
			hero.x = Math.min(Math.max(0, hero.x + velocity * step), STAGE_WIDTH - HERO_WIDTH);
			if (hero.onFloor) {
				var floor = hero.onFloor;
				if (hero.x < floor.x - HERO_WIDTH || hero.x >= floor.x + FLOOR_WIDTH) {
					hero.onFloor = null; //leaving the floor
					floor.leaving(hero, time);
				}
			}
		}
	}

	function updateAllVerticalPosition(step, time) {
		var floorDistance = step * floorVelocity;
		for (var i = 0, len = floorArray.length; i < len; ++i) {
			floorArray[i].y += floorDistance;
		}

		if (hero.onFloor) {
			var floor = hero.onFloor;
			hero.y = floor.y - floor.getHeight();
		} else {
			var heroDistance = hero.vy * step + 0.5 * GRAVITY_ACC * step * step; // v0t + 1/2gt^2
			var newY = hero.y + heroDistance;
			//detect collision
			var hasCollision = false;
			var minX = hero.x - FLOOR_WIDTH, maxX = hero.x + HERO_WIDTH;
			for (var i = 0, len = floorArray.length; i < len; ++i) {
				var floor = floorArray[i];
				if (floor.x >= minX && floor.x < maxX && floor.getHeight() > 0) {
					if (newY >= floor.y - floor.getHeight() && hero.y < floor.y - floor.getHeight() - floorDistance) { //collision
						if (window.DEBUG) {
							console.info(newY, floor.y - floor.getHeight(), hero.y, floor.y - floor.getHeight() - floorDistance);
						}
						hero.y = floor.y - floor.getHeight();
						hero.onFloor = floor;
						floor.landing(hero, time);
						hasCollision = true;
						break;
					}
				}
			}
			if (!hasCollision) {
				hero.y = newY;
				hero.vy += GRAVITY_ACC * step; // v0 + gt;
			}
		}
	}

	function judge() {
		if (hero == null || hero.y > STAGE_HEIGHT + hero.height || hero.life <= 0) {
			return true;
		}
		return false;
	}

	function checkHittingTop(time) {
		if (hero.y - hero.height < /*ARROW_HEIGHT + */MARGIN_TOP) {
			hero.y = /*ARROW_HEIGHT + */MARGIN_TOP + hero.height;
			hero.vy = 0;
			hero.hurt(5, time);
			if (hero.onFloor) {
				var floor = hero.onFloor;
				hero.onFloor = null;
				floor.leaving(hero, time);
			}
		}
	}

	function drawAll(context, time) {
		context.save();
		context.beginPath();
		context.rect(0, MARGIN_TOP, STAGE_WIDTH, STAGE_HEIGHT - MARGIN_TOP);
		context.clip();
		context.drawImage($res.bg, 0, MARGIN_TOP, STAGE_WIDTH, STAGE_HEIGHT - MARGIN_TOP);
		for (var i = 0, len = floorArray.length; i < len; ++i) {
			floorArray[i].draw(context, time);
		}
		hero.draw(context, time);
		context.beginPath();
		context.moveTo(0.5, MARGIN_TOP + 0.5);
		for (var x = 0.5; x < STAGE_WIDTH; ) {
			context.lineTo(x += ARROW_WIDTH, MARGIN_TOP + ARROW_HEIGHT - 0.5);
			context.lineTo(x += ARROW_WIDTH, MARGIN_TOP + 0.5);
		}
		context.closePath();
		context.fillStyle = '#fff';
		context.fill();
		context.stroke();

		if (!isRunning) {
			context.save();
			context.translate(STAGE_WIDTH * 0.5, STAGE_HEIGHT * 0.5);
			if (isCooldownTime) {
				context.textAlign = 'center';
				context.font = 'bold 32pt monospace';
				context.strokeStyle = '#fff';
				context.lineWidth = 6;
				context.strokeText('Game Over', 0, 10);
				context.fillStyle = '#000';
				context.fillText('Game Over', 0, 10);
			} else {
				if (!isFinite(spacePressed)) {
					context.beginPath();
					roundRect(context, -109.5, -29.5, 219, 59, 10);
					context.fillStyle = 'rgba(0, 0, 0, 0.5)';
					context.fill();
					context.translate(-5, -5);
				}
				context.beginPath();
				roundRect(context, -109.5, -29.5, 219, 59, 10);
				context.fillStyle = '#fff';
				context.fill();
				context.fillStyle = '#000';
				context.font = 'bold 24pt monospace';
				context.textAlign = 'center';
				context.fillText(judge() ? 'play again' : 'continue', 0, 10);
			}
			context.restore();
		}

		context.restore();
		
		if (topBarChange) {
			topBarChange = false;
			context.save();
			context.clearRect(0, 0, STAGE_WIDTH, MARGIN_TOP);
			context.fillStyle = '#000';
			context.font = '12pt monospace';
			context.fillText('life: ' + 'oooooooooo----------'.substr(10 - hero.life, 10) + '  score: ' + score, 10, 24);
			context.restore();
		}

		if (window.DEBUG) {
			context.save();
			context.font = '12pt monospace';
			context.fillText(((drawCount + lastDrawCount) * 1000 / (lastInterval + time - drawCountStartTime)).toFixed(2) + ' fps', 10, MARGIN_TOP + 30);
			if (++drawCount > 20) {
				lastInterval = time - drawCountStartTime;
				lastDrawCount = 20;
				drawCount -= 20;
				drawCountStartTime = time;
			}
			context.restore();
		}
	}

	function updateScore(floorSeq) {
		var newScore = Math.floor(floorSeq * 0.2);
		if (newScore != score) {
			topBarChange = true;
			var newLevel = Math.floor(newScore * 0.1);
			if (newLevel > level) {
				console.info('level up', newLevel);
				level = newLevel;
				floorVelocity = (1 + 0.1 * level) * FLOOR_VELOCITY_BASE;
				//floorVelocity = (1 + 0.0001 * level) * FLOOR_VELOCITY_BASE;
				//console.log(level,floorVelocity);
			}
			score = newScore;
		}
	}

	function loop(step, time) {
		if (hero.onFloor) {
			var floor = hero.onFloor;
			floor.standing(hero, time);
		}
		generateFloor();
		removeOutboundFloor();
		updateHeroHorizontalPostion(step, time);
		updateAllVerticalPosition(step, time);
		checkHittingTop(time);
		return judge();
	}

	function frame(time) {
		if (window.DEBUG_TIME) {
			time *= window.DEBUG_TIME;
		}
		if (!lastTime) {
			lastTime = time;
		}
		var duration = time - lastTime;
		if (duration > 2000) {
			console.info('Pause, duration: ' + duration);
			isRunning = false;
			window.addEventListener('touchmove', onMove, false);
		} else {
			var ended = false;
			for (; duration > MAX_ACTION_INTERVAL; duration -= MAX_ACTION_INTERVAL) {
				ended = loop(MAX_ACTION_INTERVAL, time - duration);
				if (ended) {
					break;
				}
			}
			if (!ended) {
				ended = loop(duration, time);
			}
			if (ended) {
				isCooldownTime = true;
				setTimeout(function() {
					isCooldownTime = false;
					drawAll($ctx, time);
				}, 1000);
				bestScore = Math.max(score, bestScore);
				fireEvent('gameOver', score, bestScore);
				isRunning = false;
				window.addEventListener('touchmove', onMove, false);
			}
		}
		drawAll($ctx, time);
		lastTime = time;
		if (isRunning) {
			requestAnimationFrame(frame);
		}
	}

	function resizeCanvas($wrap, $canvas, $ctx) {
		var screenWidth = document.documentElement.clientWidth;
		var screenHeight = document.documentElement.clientHeight;
		var zoomRate = Math.min(screenWidth / STAGE_WIDTH, screenHeight / STAGE_HEIGHT);
		var ratio = window.devicePixelRatio || 1;
		$canvas.style.width = (STAGE_WIDTH * zoomRate) + 'px';
		$canvas.style.height = (STAGE_HEIGHT * zoomRate) + 'px';
		$canvas.width = STAGE_WIDTH * zoomRate * ratio;
		$canvas.height = STAGE_HEIGHT * zoomRate * ratio;
		
		$ctx.setTransform(zoomRate * ratio, 0, 0, zoomRate * ratio, 0, 0);
		topBarChange = true;
		if (lastTime) {
			drawAll($ctx, lastTime);
		}
		console.info('resize rate=' + zoomRate + ", ratio=" + ratio + ", width=" + $canvas.width + ", height=" + $canvas.height);
	}

	function onMove(e) {
		if (isFinite(spacePressed)) {
			spacePressed = NaN;
			drawAll($ctx, lastTime);
		}
	}

	function init(res) {
		$res = res;
		$canvas = document.createElement('canvas');
		// $canvas.width = STAGE_WIDTH;
		// $canvas.height = STAGE_HEIGHT;
		// $canvas.style.width = '0px';
		// $canvas.style.height = '0px';
		// $canvas.style.transition = 'width 0.5s, height 0.5s';
		$canvas.style.display = 'block';
		$canvas.style.margin = '0 auto';
		clearNode($wrap);
		$wrap.appendChild($canvas);

		$ctx = $canvas.getContext('2d');
		
		setTimeout(function() {
			resizeCanvas($wrap, $canvas, $ctx);
	    }, 50);
	
		window.addEventListener('resize', function() {
			resizeCanvas($wrap, $canvas, $ctx);
			if (isRunning) {
				$canvas.scrollIntoView();
			}
		}, false);

		//regist control
		window.addEventListener('keydown', function(e) {
			if (e.keyCode == 37) { // left
				leftPressed = 0;
				hero.turnLeft();
				e.preventDefault();
				e.stopPropagation();
			} else if (e.keyCode == 39) { // right
				rightPressed = 0;
				hero.turnRight();
				e.preventDefault();
				e.stopPropagation();
			} else if (e.keyCode == 32 || e.keyCode == 13) { // space or enter
				if (!isRunning && !isCooldownTime) {
					spacePressed = 0;
					drawAll($ctx, lastTime);
				}
				e.preventDefault();
				e.stopPropagation();
			}
		}, false);
		window.addEventListener('keyup', function(e) {
			if (e.keyCode == 37) {
				leftPressed = NaN;
				if (isFinite(rightPressed)) {
					hero.turnRight();
				} else {
					hero.stay();
				}
			} else if (e.keyCode == 39) {
				rightPressed = NaN;
				if (isFinite(leftPressed)) {
					hero.turnLeft();
				} else {
					hero.stay();
				}
			} else if (isFinite(spacePressed) && (e.keyCode == 32 || e.keyCode == 13)) {
				spacePressed = NaN;
				start();
			}
		}, false);
		window.addEventListener('touchstart', function(e) {
			var touch = e.changedTouches[0];
			if (touch) {
				if (!isRunning) {
					if (!isCooldownTime && e.target == $canvas) {
						spacePressed = touch.identifier;
						drawAll($ctx, lastTime);
					}
				} else if (touch.clientX < document.documentElement.clientWidth * 0.5) {
					leftPressed = touch.identifier;
					hero.turnLeft();
					e.preventDefault();
					e.stopPropagation();
				} else {
					rightPressed = touch.identifier;
					hero.turnRight();
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}, false);
		window.addEventListener('touchend', function(e) {
			var touch = e.changedTouches[0];
			if (touch) {
				if (touch.identifier == spacePressed) {
					spacePressed = NaN;
					start();
				} else if (touch.identifier == leftPressed) {
					leftPressed = NaN;
					if (isFinite(rightPressed)) {
						hero.turnRight();
					} else {
						hero.stay();
					}
				} else if (touch.identifier == rightPressed) {
					rightPressed = NaN;
					if (isFinite(leftPressed)) {
						hero.turnLeft();
					} else {
						hero.stay();
					}
				}
			}
		}, false);
		window.addEventListener('touchcancel', function(e) {
			var touch = e.changedTouches[0];
			if (touch) {
				if (touch.identifier == leftPressed) {
					leftPressed = NaN;
					if (isFinite(rightPressed)) {
						hero.turnRight();
					} else {
						hero.stay();
					}
				} else if (touch.identifier == rightPressed) {
					rightPressed = NaN;
					if (isFinite(leftPressed)) {
						hero.turnLeft();
					} else {
						hero.stay();
					}
				}
			}
		}, false);
		//start loop
		start();
	}

	function start() {
		if (isRunning) {
			return;
		}
		if (judge()) {
			fireEvent('gameStart');
			//create world
			FloorSeq.reset();
			floorArray = [];
			hero = new Hero((STAGE_WIDTH - HERO_WIDTH) * 0.5, STAGE_HEIGHT - FLOOR_DISTANCE);
			floorVelocity = FLOOR_VELOCITY_BASE;
			score = 0;
			level = 0;
			topBarChange = true;
		}
		window.removeEventListener('touchmove', onMove, false);
		isRunning = true;
		lastTime = 0;
		$canvas.scrollIntoView();
		requestAnimationFrame(frame);
	}

	Game.launch = function($wrapNode) {
		$wrap = $wrapNode;
		loadImage({
			bg : 'bg.png',
			hero : 'led.png'
		}, init);
	}

	Game.on = onEvent;
	Game.off = offEvent;

}(window);
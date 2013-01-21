;(function($) {

	function StereoCarousel(context, config) {
		this.context = context;
		this.config = $.extend({
			auto: true,
			slideTime: 300,
			stayTime: 3000
		}, config);
		//控件控制元素
		this.container = context;
		this.controlLeft = context.find("a.stereo-control-left");
		this.controlRight = context.find("a.stereo-control-right");
		this.listCurrent = context.find("div.stereo-list-current");
		this.listLeft = context.find("div.stereo-list-left");
		this.listRight = context.find("div.stereo-list-right");
		//页码标示
		this.pageLists = context.find("ul.stereo-num").children();
		this.currentIndex = 0;
		this.maxIndex = 2;
		this.init();
	}
	StereoCarousel.prototype = {
		constructor: StereoCarousel,
		_setData: function() {
			this.data = {
				left: {
					top: 53,
					left: 0,
					width: 374,
					height: 176
				},
				right: {
					top: 53,
					left: 580,
					width: 374,
					height: 176
				},
				current: {
					top: 0,
					left: 219,
					width: 525,
					height: 247
				}
			};
		},
		_bindEvent: function() {
			var self = this;
			$.each(this.pageLists, function(index, ele) {
				$(ele).click(function() {
					clearTimeout(self.countTime);
					self.switchTo(index);
				});
			});
			this.controlLeft.click(function() {
				clearTimeout(self.countTime);
				self.goRight();
			});
			this.controlRight.click(function() {
				clearTimeout(self.countTime);
				self.goLeft();
			});
			this.controlLeft
			.add(this.controlRight)
			.hover(function() {
				$(this).css("opacity", 1);
			}, function() {
				$(this).css("opacity", 0.7);
			});
		},
		_setAuto: function() {
			var self = this;
			if ( !this.config.auto ) return;
			this.countTime = setTimeout(function() {
				self.goLeft();
			}, this.config.stayTime);
		},
		init: function() {
			this._setData();
			this._bindEvent();
			this._setAuto();
		},
		//向左
		goLeft: function() {
			var self = this;
			if ( self.currentIndex === self.maxIndex ) self.currentIndex = -1;
			self.go(1);
		},
		//向右
		goRight: function() {
			var self = this;
			if ( self.currentIndex === 0 ) self.currentIndex = self.maxIndex+1;
			self.go(-1);
		},
		switchTo: function(index) {
			if ( this.isAnimating || this.currentIndex === index ) return;
			if ( index+1 === this.currentIndex ||
					index-2 === this.currentIndex ) {
				//向右移动
				this.goRight();
			} else if ( index-1 === this.currentIndex ||
					index+2 === this.currentIndex ) {
				//向左移动
				this.goLeft();
			}
		},
		go: function(dir) {
			var self = this,
				dir = dir > 0 ? true : false;
			if ( this.isAnimating ) return;
			this.isAnimating = true;
			this.listCurrent.find("div.stereo-carousel-mask").show();
			if ( dir ) {
				this.listRight
				.css("z-index", 106)
				.find("div.stereo-carousel-mask").hide();
			} else {
				this.listLeft
				.css("z-index", 106)
				.find("div.stereo-carousel-mask").hide();
			}
			this.listCurrent.animate(dir ? this.data.left : this.data.right, this.config.slideTime);
			this.listLeft.animate(dir ? this.data.right : this.data.current, this.config.slideTime);
			this.listRight.animate(dir ? this.data.current : this.data.left, this.config.slideTime, function() {
				self.animatedCallback(dir);
			});
		},
		animatedCallback: function(dir) {
			var tempCurrent = this.listCurrent,
				tempLeft = this.listLeft;
			//重新分配DOM元素
			this.listCurrent = dir ? this.listRight : this.listLeft;
			this.listLeft = dir ? tempCurrent : this.listRight;
			this.listRight = dir ? tempLeft : tempCurrent;
			this.isAnimating = false;
			this.listLeft
			.add(this.listRight)
			.css("z-index", 100);
			this.listCurrent
			.css("z-index", 105);

			dir ? this.currentIndex++ : this.currentIndex--;
			this.pageLists.removeClass("stereo-num-current")
			.eq(this.currentIndex).addClass("stereo-num-current");

			this._setAuto();
		}
	};

	$.fn.extend({
		stereoCarousel: function(setting) {
			this.each(function() {
				new StereoCarousel($(this), setting || {});
			});			
		}
	});
})(jQuery)
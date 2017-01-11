

(function($) {
  'use strict';

  var $Base = function (option) {
    this.option = $.extend({
      'pageloading': {
        'run' : true,
        'delay': 0,
        'classname': 'is-loading'
      },
      'scrollto' : {
        'run' : true,
        'speed' : 800
      },
      'labelstat' : {
        'run' : false,
        'classname' : 'is-checked'
      },
      'linkstyle' : {
        'run' : false,
        'modalclassname' : 'popup'
      },
      'setheight' : {
        'run' : false,
        'selector' : '.height-group'
      }
    }, option);
    this.start();
  };

  $Base.prototype = {
    option: {},

    start: function() {
      var self = this;
      $('html').removeClass('no-js');
      if (self.option.pageloading.run) self.pageLoading();
      if (self.option.scrollto.run) self.pageScroll();
      if (self.option.labelstat.run) self.labelStat();
      if (self.option.linkstyle.run) self.linkStyle();
      if (self.option.setheight.run) self.setHeight();
      self.spMenuClass();
      self.accordion();
    },

    pageLoading : function(classname, delay) {
      var self = this;
      $('body').addClass(self.option.pageloading.classname);
      $(window).on('load', function() {
        window.setTimeout(function() {
          $('body').removeClass(self.option.pageloading.classname);
        }, self.option.pageloading.delay);
      });
    },

    pageScroll : function() {
      var self = this;
      $('a[href^="#"]:not([href$="#"])').on("click", function(e) {
        e.preventDefault();
        var href= $( this).attr( "href"),
          target = $(href === "#top" || href === "" ? 'html' : href),
          position = target.offset().top;
          // position -= self.pageScrollOffset();
        $('body,html').animate({scrollTop:position}, self.option.scrollto.speed, 'swing');
      });
    },

    pageScrollOffset : function( element ) {
      var h;
      if ( this.displayStat($('.nav-main'))){
        h = $('.nav-main').outerHeight(true);
      }else{
        h = $('.page-header').outerHeight(true);
      }
      return h;
    },

    linkStyle : function() {
      var self = this;
      $('a[href^="http"]:not([href*="' + location.hostname + '"])').attr('target', '_blank').addClass('blank');
      $('a[href$=".pdf"]').attr('target', '_blank').addClass('pdf');
      $('a').filter(function(){return /\.(jpe?g|png|gif)$/i.test(this.href);}).addClass(self.option.linkstyle.modalclassname);
    },

    labelStat : function() {
      var self = this,
          label = $('label');
      label.find(':checked').closest('label').addClass(self.option.labelstat.classname);
      label.on('click', function() {
        label.filter('.checked').removeClass(self.option.labelstat.classname);
        label.find(':checked').closest(label).addClass(self.option.labelstat.classname);
      });
    },

    displayStat : function ( element ) {
      return (element.css('display') === 'block') ? true : false;
    },

    spMenuClass : function() {
      var button = $('#js-sp-menu');
      button.on('click', function() {
        $('#js-nav-sp,#js-sp-menu').toggleClass('is-open');
      });
    },

    accordion : function() {
      var button = $('.js-accordion > :first-child');
      var body = button.next();
      body.hide();
      button.on('click', function(){
        var it = this;
        body = $(this).next();
        body.stop().slideToggle(800, function(){
          if (body.css('display') === 'block'){
            $(it).addClass('is-open');
          }else{
            $(it).removeClass('is-open');
          }
          // $(window).trigger('scroll');
        });
      });
    },

    setHeight : function() {
      var self = this,
          selector = self.option.setheight.selector.split(',');

      $(window).on('load', function(){
        for (var i = 0; i < selector.length; i++) {
          if ($(selector[i]).length > 0) $(selector[i]).tile();
        }
      });
      $(window).on('resize', function() {
        var timer = false;
        if (timer !== false) clearTimeout(timer);
        timer = setTimeout( function() {
          for (var i = 0; i < selector.length; i++) {
            if ($(selector[i]).length > 0) $(selector[i]).tile();
          }
        },400);
      });
    },

    cpYear : function( selector, fromYear ) {
      var now = new Date();
      var html = (fromYear < now.getFullYear()) ? ' - ' + now.getFullYear() : '';
      $(selector).html(html);
    }
  };

  /**
 * Flatten height same as the highest element for each row.
 *
 * Copyright (c) 2011 Hayato Takenaka
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * @author: Hayato Takenaka (https://github.com/urin/jquery.tile.js)
 * @version: 1.1.1
 **/
  $.fn.tile=function(t){var n,r,i,s,o,u,a=document.body.style,f=["height"],l=this.length-1;if(!t)t=this.length;u=a.removeProperty?a.removeProperty:a.removeAttribute;return this.each(function(){u.apply(this.style,f)}).each(function(u){s=u%t;if(s==0)n=[];r=n[s]=$(this);o=r.css("box-sizing")=="border-box"?r.outerHeight():r.innerHeight();if(s==0||o>i)i=o;if(u==l||s==t-1){$.each(n,function(){this.css("height",i)})}})}

  $(function() {
    var $base = new $Base();
  });

})(jQuery);
// Google Analytics
// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// ga('create', 'UA-xxxxxxxx-1', 'auto');
// ga('send', 'pageview');

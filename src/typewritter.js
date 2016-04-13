/*
 * 
 * 
 *
 * Copyright (c) 2015 Michał Baryś
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";
  var Typewritter = function(el, options){

    // chosen element to manipulate text
    this.el = $(el);

    // options
    this.options = $.extend({}, $.fn.typewritter.defaults, options);

    console.log(this.options);

    this.content;

    this.isInput = false;

    this.isTag = false;

    this.index = 0;

    this.timer = null;

    this.isPaused = false;

    this.backspaceIndexes = [];

    this.init();

  }

  Typewritter.prototype = {

    init: function()
    {
      if( this.el.prop("tagName") === 'INPUT' ){
        this.isInput = true;
      }

      if( this.isInput )
      {
        this.content = this.el.val();
        this.el.val(''); 
        this.el.focus();
      }
      else
      {
        this.setElementSize();
        this.content = this.el.html();
        this.el.empty();
      }

      this.el.addClass('typewritter').addClass('tw-idle');
      if( this.options.cursor === true )
      {
        this.el.addClass('tw-cursor');
      }

      if( this.options.skipTags === true )
      {
        this.content = this.content.replace(/(<([^>]+)>)/ig,"");
      }

      this.content = this.content.replace(/\r?\n|\r|\t/g, "");


      var self = this;
      setTimeout( function(){self.start();}, this.options.startDelay );
    },

    setElementSize : function()
    {
      this.el.width(this.el.width());
      this.el.height(this.el.height());
    },

    clearTimer: function()
    {
      clearTimeout(this.timer);
      this.timer = null;
    },

    prepare: function()
    {
      var re = /({([^}]+)})/ig;
      var arr;
      var occur = 0;
      while ((arr = re.exec(this.content)) !== null) {

        var start = arr.index - (occur++);
        var end = re.lastIndex - 1 - (++occur);

        this.backspaceIndexes.push([ start, end ]);

        console.log('start: ' + start, 'end: ' + end );
        
        
      }
      this.content = this.content.replace(/({|})/ig,"");
    },

    humanize: function( value )
    {
      if( this.options.humanize === false )
      {
        return value;
      }
      

      if( (Math.round(Math.random() * 2) +1) === 1 )
      {
        value *= (Math.round(Math.random() * 5) +1);
      }
      else
      {
        value *= (Math.round(Math.random() * 5) +1);
      }
      console.log(value);
      return value;

      //return value *=  ((Math.round(Math.random() * 151) -50) / 10 );
      // return (Math.round(Math.random() * 161) -60) + value;
    },

    start: function()
    {
      this.el.removeClass('tw-idle');
      this.options.onStart();
      this.prepare();
      this.type();
    },

    type: function()
    {
      if( this.isPaused === true )
      {
        console.log('is paused');
        return;
      }
        
      var text = this.content.slice(0, ++this.index);

      var self = this;

      var stop = false;
      this.backspaceIndexes.forEach( function(arr, idx){
        // console.log('type', arr[1], self.index);
        if( arr[1] == self.index - 2 )
        {
          self.clearTimer();
          self.delete();
          stop = true;
        }
      });

      if( stop )
      {
        return;
      }


      if( this.options.onTypeBefore )
      {
        this.options.onTypeBefore(this.index-1, text.slice(-1), text);
      }
      if( this.isInput ){
        this.el.val( text );
      }
      else
      {
        this.el.empty().html( text );
      }

      if( this.options.onTypeAfter )
      {
        this.options.onTypeAfter(this.index-1, text.slice(-1), text);
      }

      var char = text.slice(-1);
      if( char === '<' ) 
      {
        this.isTag = true;
      }
      if( char === '>' )
      {
        this.isTag = false;  
      } 

      if( this.isTag ) 
      {
        return this.type();
      }

      if( text === this.content ) {
        this.complete();
        return;
      }

      var self = this;
      
      this.timer = setTimeout(function(){self.type();}, this.humanize(this.options.speed));
      
    },

    delete: function()
    {
      // console.log('delete');
      //return;
      var text = this.content.slice(0, --this.index);


      var self = this;
      var stop = false;

      
      this.backspaceIndexes.forEach( function(arr, idx){
        // console.log('delete', arr, idx);
        if( arr[0] === self.index + 1  )
        {
          self.clearTimer();
         

          var curr = self.backspaceIndexes.shift();


          self.content = self.content.slice( 0, curr[0]) + self.content.slice( curr[1]+1);
          // console.log('new content', self.content);

          if( self.backspaceIndexes.length > 0 )
          {
            self.backspaceIndexes[idx][0] -= (curr[1] - curr[0] + 1 );
            self.backspaceIndexes[idx][1] -= (curr[1] - curr[0] + 1 );
          }

          //self.pause();
          //self.pause();
          //self.index += arr[1] - arr[0] + 1;
          //self.content = self.content.replace(self.content.substring(arr[0], arr[1]), "");
          //self.deleteIndexes.splice(idx, 1);
          //self.content = self.content.slice( arr[1], arr[0] );
          // console.log( 'new content:', self.content );
          // console.log('INDEX', self.index);
          // self.pause();
          self.type();
          stop = true;
        }
      });

      if( stop )
      {
        return;
      }

      if( this.isInput ){
        this.el.val( text );
      }
      else
      {
        this.el.empty().html( text );
      }

      clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(function(){self.delete();}, this.humanize(this.options.backspaceSpeed));
    },

    complete: function()
    {
      this.el.removeAttr('style');
      if( this.options.onComplete )
      {
        this.el.addClass('tw-idle');
        this.options.onComplete();
      }
    },

    pause: function( miliseconds )
    {
      console.log('pause', this.timer);
      this.isPaused = true;
      clearTimeout(this.timer);
      this.el.addClass('tw-idle');

      if( typeof miliseconds !== 'undefined' )
      {
        var self = this;
        setTimeout( function(){
          self.resume();
        }, miliseconds );
      }
      
    },

    resume: function()
    {
      this.isPaused = false;
      this.el.removeClass('tw-idle');
      this.type();
    }

  }



  $.fn.typewritter = function( option, value )
  {
    return this.each(function() {

      var $this = $(this),
          data = $this.data('typed'),
          options = typeof option == 'object' && option;
      if (!data) $this.data('typed', (data = new Typewritter(this, options)));
      if (typeof option == 'string'){
        if( typeof value !== 'undefined' && data.options.hasOwnProperty(option) )
        {
          data.options[option] = value;
        }
        else
        {
          data[option](value);  
        }
          
      } 
    });
  }

  $.fn.typewritter.defaults = {
    cursor: true,
    text: null,
    startDelay: 0,
    speed: 50,
    backspaceSpeed: 200,
    humanize: false,
    skipTags: false,
    onStart: null,
    onTypeBefore: null,
    onTypeAfter: null,
    onComplete: null

  }

}(jQuery));

(function ($) {
  'use strict';
  $.fn.typewritter22 = function ( options ) {

    var defaults = {
      cursor: true,
      text: null,
      startDelay: 0,
      speed: 50,
      skipTags: false,
      onStart: null,
      onTyping: null,
      onComplete: null
    };

    var settings = $.extend( {}, defaults, options );

    return this.each(function (idx) {
      // Do something to each selected element.


      var $elem = $(this);

      if( $elem.prop("tagName") !== 'INPUT' ){
      
        var sizes = [];
        console.log($elem.css('box-sizing'));
        switch( $elem.css('box-sizing') )
        {
        	// case 'padding-box':
        	// 	sizes = [ $(this).innerWidth(), $(this).innerHeight() ];
        	// 	console.log('padding-box');
        	// break;

        	// case 'border-box':
        	// 	sizes = [ $(this).outerWidth(), $(this).outerHeight() ];
        	// 	console.log('border-box');
        	// break;

        	default:
        		sizes = [ $elem.width(), $elem.height() ];
        		console.log('content-box');

        }

        

        $elem.width(sizes[0]);
        $elem.height(sizes[1]);
      }
      $elem.addClass('typewritter').addClass('tw-idle');
      if( settings.cursor === true )
      {
        $elem.addClass('tw-cursor');
      }



      var str,
      i = 0,
      isTag;

      if( $elem.prop("tagName") === 'INPUT' ){
        str = $elem.val();
        $elem.val(''); 
        $elem.focus();
      }
      else
      {
        str = $elem.html();
        $elem.empty();  
      }
      
      
      if( settings.skipTags === true )
      {
        str = str.replace(/(<([^>]+)>)/ig,"");
      }

      console.log('str', str);

      function start(){
        // rozpoczyna pisanie
      }

      function pause()
      {
        // zatrzymuje pisanie w dowolnym momencie
      }

      function resume()
      {
        // wznawia pisanie po pauzie
      }

      function reset()
      {
        // zaczyna pisanie od nowa
      }

      function disable()
      {
        // wyłacza plugin - przywraca element DOM do stanu początkowego.
      }

      function backspace()
      {
        // pozwala kasować słowa
      }


		  function type(){

        if( i === 0 && settings.onStart )
        {

          $elem.removeClass('tw-idle');
          settings.onStart();
        }
	    	
        var text = str.slice(0, ++i);


        if( settings.onTyping )
        {
          settings.onTyping(i-1, text.slice(-1), text);
        }
        if( $elem.prop("tagName") === 'INPUT' ){
          $elem.val( text );
        }
        else
        {
          $elem.empty().html( text );
        }

        var char = text.slice(-1);
        if( char === '<' ) 
        {
          isTag = true;
        }
        if( char === '>' )
        {
          isTag = false;  
        } 

        if (isTag) 
        {
          return type();
        }

        if (text === str) {
          $elem.removeAttr('style');
          if( settings.onComplete )
          {
            $elem.addClass('tw-idle');
            settings.onComplete();
          }
          return;
        }

        setTimeout(type, settings.speed);
	        
		  };

      setTimeout(type, settings.startDelay);




    });
  };
}(jQuery));

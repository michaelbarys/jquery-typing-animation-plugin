/*
 * 
 * 
 *
 * Copyright (c) 2015 Michał Baryś
 * Licensed under the MIT license.
 */

(function ($) {

  "use strict";
  var jtap = function(el, options){

    // chosen element to manipulate text
    this.el = $(el);

    // options
    this.options = $.extend({}, $.fn.jtap.defaults, options);

    console.log(this.options);

    this.content = null;

    this.isInput = false;

    this.isTag = false;

    this.index = 0;

    this.timer = null;

    this.isPaused = false;

    this.backspaceIndexes = [];

    this.init();

  };

  jtap.prototype = {

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

      this.el.addClass('jtap').addClass('jtap-idle');
      if( this.options.cursor === true )
      {
        this.el.addClass('jtap-cursor');
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
      this.isPaused = false;
      this.el.removeClass('jtap-idle');
      if( this.options.onStart )
      {
        this.options.onStart();
      }
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
        if( arr[1] === self.index - 2 )
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
        this.el.addClass('jtap-idle');
        this.options.onComplete();
      }
    },

    pause: function( miliseconds )
    {
      console.log('pause', this.timer);
      this.isPaused = true;
      clearTimeout(this.timer);
      this.el.addClass('jtap-idle');

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
      this.el.removeClass('jtap-idle');
      this.type();
    },

    reset: function( startDelay ){
      this.timer = null;
      this.index = 0;

      if( !startDelay ){
        startDelay = this.options.startDelay;
      }
      this.pause();
      var self = this;
      setTimeout( function(){self.start();}, startDelay );
    }

  }



  $.fn.jtap = function( option, value )
  {
    return this.each(function() {

      var $this = $(this),
          data = $this.data('typed'),
          options = typeof option == 'object' && option;
      if (!data) {
        $this.data('typed', (data = new jtap(this, options)));
      }
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

  $.fn.jtap.defaults = {
    cursor: true,
    startDelay: 0,
    speed: 50,
    backspaceSpeed: 200,
    humanize: true,
    skipTags: true,
    onStart: null,
    onTypeBefore: null,
    onTypeAfter: null,
    onComplete: null

  }

}(jQuery));



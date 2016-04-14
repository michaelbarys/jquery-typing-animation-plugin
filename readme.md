# jQuery typing animation plugin

> Typing animation for any text on webpage


## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/michaelbarys/jquery-jquery-typing-animation-plugin/master/dist/jquery.jquery-typing-animation-plugin.min.js
[max]: https://raw.githubusercontent.com/michaelbarys/jquery-jquery-typing-animation-plugin/master/dist/jquery.jquery-typing-animation-plugin.js

## Example

HTML:
```html
<p class="demo">Leciała {pszczoła}mucha z Łodzi do Zgierza,<br />
Po drodze patrzy: strażacka wieża,<br />
Na wieży strażak zasnął i chrapie,<br />
W dole pod wieżą gapią się {lud}gapie.</p>

<script src="jquery.js"></script>
<script src="jquery-typing-animation-plugin.min.js"></script>
```

JavaScript:
```javascript
$('p.demo').jtap({
	startDelay: 0,
	cursor: true,
	speed: 20, 
	backspaceSpeed: 50,
	humanize: true,
	skipTags: false,
	onStart: function()
	{
		// do something before start typing
	},
	onTypeBefore: function( idx, char, text )
	{ 
		// do something before type char
		// when idx is index of this char

		if( idx === 5 )
		{
			// do something when char index is 5
		} 
	},
	onTypeAfter: function( idx, char, text )
	{
		// do something after char is typed
		// when idx is index of this char

		if( idx === 5 )
		{
			// do something when char with index 5 was typed
		}
	},
	onComplete: function()
	{
		// do something after typing is complete
	}
});
```

## Options
### Config
* <samp>startDelay</samp> - delay in miliseonds (default: 0)
* <samp>cursor</samp> - boolean true or false (default: true)
* <samp>speed</samp> - typing speed ratio (default: 50)
* <samp>backspaceSpeed</samp> - erasing speed ratio (default: 200)
* <samp>humanize</samp> - randomize speed of typing single char (default: true)
* <samp>skipTags</samp> - skip HTML tags (default: true)

### Callbacks
* <samp>onStart</samp> - triggered before startying typing
* <samp>onTypeBefore</samp> - triggered before type char
* <samp>onTypeAfter</samp> - triggered after char is typed
* <samp>onComplete</samp> - triggered when typing is end

### Methods
* <code>.jtap('pause', <var>[optional pause time in miliseconds]</var>)</code> - if you not set <code><var>optional pause time</var></code>, then you must use <code>.jtap('resume')</code>, to resume typing.
* <code>.jtap('resume')</code> - resume typing after pause.
* <code>.jtap('reset', <var>[optional startDelay]</var>)</code> - reset typing and start again

## License

MIT © Michał Baryś

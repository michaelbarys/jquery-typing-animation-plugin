(function(){
	'use strict';

	var str = "Lorem_{ipsum}_dolor_sit_{amet}_non_profit_du_zero";


	var re = /({([^}]+)})/ig;

	var indexes = [];

	//this.content = this.content.replace(/({|})/ig,"");

	var myArray;
	var occur = 0;
	while ((myArray = re.exec(str)) !== null) {

		//console.log('start: ' + ( myArray.index - (occur++)), 'end: ' + (re.lastIndex - 1 - (++occur) ) );
	  //console.log('occur', occur);

	  var start = myArray.index - (occur++);
	  var end = re.lastIndex - 1 - (++occur);

	  indexes.push([ start, end ]);

	  console.log('start: ' + start, 'end: ' + end );
	  

	  var msg = 'Found ' + myArray[0] + '. ';
	  msg += 'Next match starts at ' + re.lastIndex;
	  // console.log(msg);
	}
	str = str.replace(/({|})/ig,"");

	//str = "Zażółć jaślą gęś";
	console.log('--------------');
	console.log( 'str.slice: ', str.slice( 0, indexes[0][0]) );
	console.log( 'str.slice: ', str.slice( indexes[0][1]+1) );
	console.log('--------------');
	//przeindeksowanie 
	indexes[1][0] -= (indexes[0][1] - indexes[0][1] );
	indexes[1][1] -= (indexes[0][1] - indexes[0][1] );

	console.log( 'str.slice: ', str.slice( 0, indexes[1][0]) );
	console.log( 'str.slice: ', str.slice( indexes[1][1]+1) );
	console.log('--------------');

	console.log( 'str.substr: ', str.substr( 3, 10) );
	console.log( 'str.substring: ', str.substr( 3, 10) );
	console.log( 'str.charAt: ', str.charAt(3) );



});
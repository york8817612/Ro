/**
 * Plugins/LoadingDonate/LoadingDonate.js
 *
 * Display a message in loading screen asking for donation
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

define(function( require )
{
	'use strict';


	// Dependencies
	var jQuery     = require('Utils/jquery');
	var Background = require('UI/Background');
	var Renderer   = require('Renderer/Renderer');
	var ui         = jQuery('<div/>');


	// Build css
	ui.css({
		width:       '220px',
		padding:     '10px',
		color:       'white',
		textAlign:   'left',
		fontSize:    '12px',
		position:    'absolute',
		left:        'calc(50% - 240px / 2)',
		zIndex:      '1000',
		background:  'rgba(0,0,0,0.5)',
		border:      '1px solid #555',
		borderRadius:'5px'
	});


	// add content
	ui.html([
		'roBrowser is a free and open source project. If you like it, why not supporting us by doing a donation ?',
		'<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style="text-align:center; padding-top:10px;">',
		'	<input type="hidden" name="cmd" value="_s-xclick">',
		'	<input type="hidden" name="hosted_button_id" value="8QKDTPRDQFF6J">',
		'	<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">',
		'</form>'
	].join('\n'));


	/**
	 * Export
	 */
	return function LoadingDonate()
	{
		var setLoading = Background.setLoading;
		Background.setLoading = function(callback)
		{
			setLoading.call(Background, function(){
				callback();
				ui.appendTo('body');
				ui.css('top', Renderer.height*0.75 - ui.height() - 35);
			})
		};

		var remove = Background.remove;
		Background.remove = function(callback)
		{
			remove.call(Background, function(){
				callback();
				ui.remove();
			})
		};
	};
});
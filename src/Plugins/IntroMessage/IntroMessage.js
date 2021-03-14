/**
 * Plugins/IntroMessage/IntroMessage.js
 *
 * Display an intro message (same as license screen)
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

define(function( require )
{
	'use strict';


	/**
	 * Load dependencies
	 */
	var WinLogin    = require('UI/Components/WinLogin/WinLogin');
	var UIComponent = require('UI/UIComponent');
	var Renderer    = require('Renderer/Renderer');


	/**
	 * Component html
	 */
	var _htmlText =
		'<div id="RegisterMessage">' +
			'<div class="border">' +
				'<div class="content">' +
					'<h1>Welcome to roBrowser</h1>' + 
					'<p>To create an account, add <strong>_M</strong> (male) or <strong>_F</strong> (female) ' +
					'behind your desired username.<br/>' +
					'Enter your password in the password input box and connect.</p>' +
					'<p><strong>Example:</strong><br/>' +
					'If my desired username is <em>Testing</em> and my desired password is <em>azerty</em>, ' +
					'then I will input <em>Testing_M</em> as login and <em>azerty</em> as password and connect.<br/>' +
					'The next time you connect, remove the _M/_F part since your account already exist.</p>' +
					'<p>It will create a male account with login <em>Testing</em> and password <em>azerty</em>.' +
					'<p class="warning"><strong>Note:</strong> This is a test server, all accounts are subjects to be deleted at any time.</p>' +
				'</div>' +
				'<div class="btns">' +
					'<button class="btn ok" data-background="btn_ok.bmp" data-hover="btn_ok_a.bmp" data-down="btn_ok_b.bmp"></button>' +
				'</div>' +
			'</div>' +
		'</div>';


	/**
	 * Component css
	 */
	var _cssText = 
		'#RegisterMessage  { position:absolute; width:376px; height:276px; border-radius:5px; background:white; padding:2px; line-height:18px; letter-spacing:0px; }' +
		'#RegisterMessage .border { border:1px solid #c1c6c2; width:364px; height:264px; padding:5px; border-radius:5px; }' +
		'#RegisterMessage .content { white-space:pre-wrap; background-color:#eff4f0; width:354px; height:230px; overflow-y:auto; padding:5px; }' +
		'#RegisterMessage .content h1 { font-size:16px; font-weight:bold; color:#154768;}' +
		'#RegisterMessage .content .warning { color:#A00; }' +
		'#RegisterMessage .btns { position:absolute; bottom: 4px; right:8px; }' +
		'#RegisterMessage .btn { border:0; width:42px; height:20px; background-repeat:no-repeat; background-color:transparent; }';


	/**
	 * Create window
	 */
	var RegisterMessage = new UIComponent('RegisterMessage', _htmlText, _cssText);


	/**
	 * Save old function
	 */
	var onAppend = WinLogin.onAppend;


	// Show Register Message, remove it and show WinLogin when
	// user click on the "ok" button
	RegisterMessage.onAppend = function(){
		this.ui.css({
			top: (Renderer.height-this.ui.height())/2,
			left:(Renderer.width -this.ui.width() )/2
		});
	};


	// Just clean up event.
	RegisterMessage.onRemove = function(){
		this.ui.unbind();
	};

	// Initialize component
	RegisterMessage.init = function(){
		this.draggable();

		this.ui.find('.ok').click(function(){
			RegisterMessage.remove();
			WinLogin.onAppend = onAppend; // just show once.
			WinLogin.append();
		});
	};


	/**
	 * Export
	 */
	return function IntroMessage()
	{
		// When WinLogin is append, remove it and show the RegisterMessage.
		WinLogin.onAppend = function(){
			WinLogin.remove();
			RegisterMessage.append();
		};
	};
});
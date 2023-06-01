/**
 * Preferences/Controls.js
 *
 * Control user preferences
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define( ['Core/Preferences'], function( Preferences )
{
	'use strict';


	/**
	 * Export
	 */
	return Preferences.get( 'Controls', {
		noctrl:  true,
		noshift: false,
        	snap: false,
        	itemsnap: false
	}, 1.0 );

});

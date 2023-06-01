/**
 * Controls/ProcessCommand.js - extended from ChatBox
 *
 * Command in chatbox handler
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function( require )
{
	'use strict';


	// Load dependencies
	var DB                 = require('DB/DBManager');
	var Emotions           = require('DB/Emotions');
	var BGM                = require('Audio/BGM');
	var Sound              = require('Audio/SoundManager');
	var Session            = require('Engine/SessionStorage');
	var PACKET             = require('Network/PacketStructure');
	var Network            = require('Network/NetworkManager');
	var ControlPreferences = require('Preferences/Controls');
	var AudioPreferences   = require('Preferences/Audio');
	var MapPreferences     = require('Preferences/Map');
	var CameraPreferences  = require('Preferences/Camera');
	var Renderer           = require('Renderer/Renderer');
	var getModule          = require;


	/**
	 * Process command
	 */
	return function processCommand( text ){
		var pkt, matches;
		var cmd = text.split(' ')[0];

		switch (cmd) {

			case 'sound':
				this.addText( DB.getMessage(27 + AudioPreferences.Sound.play), this.TYPE.INFO );
				AudioPreferences.Sound.play = !AudioPreferences.Sound.play;
				AudioPreferences.save();

				if (AudioPreferences.Sound.play) {
					Sound.stop();
				}
				return;

			case 'bgm':
				this.addText( DB.getMessage(31 + AudioPreferences.BGM.play), this.TYPE.INFO );
				AudioPreferences.BGM.play = !AudioPreferences.BGM.play;
				AudioPreferences.save();

				if (AudioPreferences.BGM.play) {
					BGM.play( BGM.filename );
				}
				else {
					BGM.stop();
				}
				return;

			case 'effect':
				this.addText( DB.getMessage(23 + MapPreferences.effect), this.TYPE.INFO );
				MapPreferences.effect = !MapPreferences.effect;
				MapPreferences.save();
				return;

			case 'mineffect':
				this.addText( DB.getMessage(687 + MapPreferences.mineffect), this.TYPE.INFO );
				MapPreferences.mineffect = !MapPreferences.mineffect;
				MapPreferences.save();
				return;

			case 'miss':
				this.addText( DB.getMessage(317 + MapPreferences.miss), this.TYPE.INFO );
				MapPreferences.miss = !MapPreferences.miss;
				MapPreferences.save();
				return;

			case 'aura':
				this.addText( DB.getMessage(711 + MapPreferences.aura), this.TYPE.INFO );
				MapPreferences.aura = !MapPreferences.aura;
				MapPreferences.save();
				return;

			case 'camera':
				this.addText( DB.getMessage(319 + CameraPreferences.smooth), this.TYPE.INFO );
				CameraPreferences.smooth = !CameraPreferences.smooth;
				CameraPreferences.save();
				return;

			case 'fog':
				MapPreferences.fog = !MapPreferences.fog;
				this.addText( 'fog ' + ( MapPreferences.fog ? 'on' : 'off'), this.TYPE.INFO );
				MapPreferences.save();
				return;

			case 'lightmap':
				MapPreferences.lightmap = !MapPreferences.lightmap;
				MapPreferences.save();
				return;

			case 'noctrl':
			case 'nc':
				this.addText( DB.getMessage(717 + ControlPreferences.noctrl), this.TYPE.INFO );
				ControlPreferences.noctrl = !ControlPreferences.noctrl;
				ControlPreferences.save();
				return;

			case 'noshift':
			case 'ns':
				this.addText( DB.getMessage(701 + ControlPreferences.noshift), this.TYPE.INFO );
				ControlPreferences.noshift = !ControlPreferences.noshift;
				ControlPreferences.save();
				return;
            		case 'snap':
				this.addText( DB.getMessage(271 + ControlPreferences.snap), this.TYPE.INFO );
				ControlPreferences.snap = !ControlPreferences.snap;
				ControlPreferences.save();
				return;

            		case 'itemsnap':
				this.addText( DB.getMessage(276 + ControlPreferences.itemsnap), this.TYPE.INFO );
				ControlPreferences.itemsnap = !ControlPreferences.itemsnap;
				ControlPreferences.save();
				return;

			case 'sit':
			case 'stand':
				pkt = new PACKET.CZ.REQUEST_ACT();
				if (Session.Entity.action === Session.Entity.ACTION.SIT) {
					pkt.action = 3; // stand up
				}
				else {
					pkt.action = 2; // sit down
				}
				Network.sendPacket(pkt);
				return;

			case 'doridori':
				Session.Entity.headDir = ( Session.Entity.headDir === 1 ? 2 : 1 );
				pkt         = new PACKET.CZ.CHANGE_DIRECTION();
				pkt.headDir = Session.Entity.headDir;
				pkt.dir     = Session.Entity.direction;
				Network.sendPacket(pkt);
				
				// Doridori recovery bonus
				if(Session.Entity.action === Session.Entity.ACTION.SIT){
					if(!Session.Entity.doriTime){
						Session.Entity.doriTime = [0,0,0,0,0];
					}
					
					Session.Entity.doriTime.shift();
					Session.Entity.doriTime.push(Renderer.tick);
					
					var doriStart = Session.Entity.doriTime[0];
					var doriEnd = Session.Entity.doriTime[4];
					
					if(doriEnd-doriStart > 1500 && doriEnd-doriStart < 3000){
						var doripkt = new PACKET.CZ.DORIDORI();
						Network.sendPacket(doripkt);
						Session.Entity.doriTime = [0,0,0,0,0];
					}
				}
				return;

			case 'bangbang':
				Session.Entity.direction = ( Session.Entity.direction + 1 ) % 8;
				pkt         = new PACKET.CZ.CHANGE_DIRECTION();
				pkt.headDir = Session.Entity.headDir;
				pkt.dir     = Session.Entity.direction;
				Network.sendPacket(pkt);
				return;

			case 'bingbing':
				Session.Entity.direction = ( Session.Entity.direction + 7 ) % 8;
				pkt         = new PACKET.CZ.CHANGE_DIRECTION();
				pkt.headDir = Session.Entity.headDir;
				pkt.dir     = Session.Entity.direction;
				Network.sendPacket(pkt);
				return;

			case 'where':
				var currentMap = getModule('Renderer/MapRenderer').currentMap;
				this.addText(
					DB.getMapName(currentMap) + '(' + currentMap + ') : ' + Math.floor(Session.Entity.position[0]) + ', ' + Math.floor(Session.Entity.position[1]),
					this.TYPE.INFO
				);
				return;

			case 'who':
			case 'w':
				pkt = new PACKET.CZ.REQ_USER_COUNT();
				Network.sendPacket(pkt);
				return;

			case 'memo':
				pkt = new PACKET.CZ.REMEMBER_WARPPOINT();
				Network.sendPacket(pkt);
				return;

			case 'chat':
				getModule('UI/Components/ChatRoomCreate/ChatRoomCreate').show();
				return;

			case 'q':
				getModule('UI/Components/ChatRoom/ChatRoom').remove();
				return;

			case 'leave':
				getModule('Engine/MapEngine/Group').onRequestLeave();
				return;

			case 'invite':
				matches = text.match(/^invite\s+(")?([^"]+)(")?/);
				if (matches && matches[2]) {
					getModule('Engine/MapEngine/Group').onRequestInvitation(0, matches[2]);
					return;
				}
				break;

			case 'organize':
				matches = text.match(/^organize\s+(")?([^"]+)(")?/);
				if (matches && matches[2]) {
					getModule('Engine/MapEngine/Group').onRequestCreationEasy(matches[2]);
					return;
				}
				break;

			case 'hi':
				getModule('Engine/MapEngine/Friends').sayHi();
				return;

			case 'guild':
				matches = text.match(/^guild\s+(")?([^"]+)(")?/);
				if (matches && matches[2]) {
					getModule('Engine/MapEngine/Guild').createGuild(matches[2]);
					return;
				}
				break;

			case 'breakguild':
				matches = text.match(/^breakguild\s+(")?([^"]+)(")?/);
				if (matches && matches[2]) {
					getModule('Engine/MapEngine/Guild').breakGuild(matches[2]);
					return;
				}
				break;

			case 'alchemist':
                pkt = new PACKET.CZ.ALCHEMIST_RANK();
				Network.sendPacket(pkt);
                return;
            case 'blacksmith':
            	pkt = new PACKET.CZ.BLACKSMITH_RANK();
				Network.sendPacket(pkt);
                return;
            case 'taekwon':
                pkt = new PACKET.CZ.TAEKWON_RANK();
				Network.sendPacket(pkt);
                return;
				
			case 'hoai':
				Session.homCustomAI = !Session.homCustomAI;
				if(Session.homCustomAI){
					getModule('UI/Components/HomunInformations/HomunInformations').resetAI();
					this.addText( DB.getMessage(1023), this.TYPE.INFO );
				} else {
					getModule('UI/Components/HomunInformations/HomunInformations').resetAI();
					this.addText( DB.getMessage(1024), this.TYPE.INFO );
				}
				return;
			
			case 'merai':
				Session.merCustomAI = !Session.merCustomAI;
				if(Session.merCustomAI){
					this.addText( DB.getMessage(1273), this.TYPE.INFO );
				} else {
					this.addText( DB.getMessage(1274), this.TYPE.INFO );
				}
				this.addText( '(Mercenary not supported yet)', this.TYPE.INFO );
				return;

		}


		// /str+
		// TODO: do we have to spam the server with "1" unit or do we have to fix the servers code ?
		matches = text.match(/^(\w{3})\+ (\d+)$/);
		if (matches) {
			var pos = ['str', 'agi', 'vit', 'int', 'dex', 'luk'].indexOf(matches[1]);
			if (pos > -1 && matches[2] !== 0) {
				pkt = new PACKET.CZ.STATUS_CHANGE();
				pkt.statusID     = pos + 13;
				pkt.changeAmount = parseInt( matches[2], 10 );
				Network.sendPacket(pkt);
				return;
			}
		}

		// Show emotion
		if (cmd in Emotions.commands) {
			pkt      = new PACKET.CZ.REQ_EMOTION();
			pkt.type = Emotions.commands[cmd];
			Network.sendPacket(pkt);
			return;
		}

		// Command not found
		this.addText( DB.getMessage(95), this.TYPE.INFO );
	};
});

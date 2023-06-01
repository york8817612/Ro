/**
 * Renderer/Effects/MagicTarget.js
 *
 * Rendering casting on ground (rotating plane)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function( require ) {

	'use strict';


	// Load dependencies
	var WebGL    = require('Utils/WebGL');
	var glMatrix = require('Utils/gl-matrix');
	var SkillId  = require('DB/Skills/SkillConst');
	var Client   = require('Core/Client');
	var Altitude = require('Renderer/Map/Altitude');
	var Session  = require('Engine/SessionStorage');
	var Camera   = require('Renderer/Camera');


	/**
	 * @var {WebGLTexture}
	 */
	var _texture;


	/**
	 * @var {WebGLProgram}
	 */
	var _program;


	/**
	 * @var {mat4}
	 */
	var mat4 = glMatrix.mat4;


	/**
	 * @var {mat4} rotation matrix
	 */
	var _matrix = mat4.create();


	/**
	 * @var {object} CastSize for each skill
	 */
	var CastSize = {};

	//Traps officially don't display their AoE size when casted on the ground
	CastSize[ SkillId.CR_SLIMPITCHER ]			= [7];
	CastSize[ SkillId.SO_ARRULLO ]				= [3,3,5,5,7];
	CastSize[ SkillId.AC_SHOWER ]				= [3,3,3,3,3,5,5,5,5,5];
	CastSize[ SkillId.NC_ARMSCANNON ]			= [7,5,3];
	//CastSize[ SkillId.HT_ANKLESNARE ]			= [3]; //trap
	CastSize[ SkillId.AM_DEMONSTRATION ]		= [3];
	CastSize[ SkillId.SC_BLOODYLUST ]			= [7];
	CastSize[ SkillId.PF_FOGWALL ]				= [3];
	//CastSize[ SkillId.HT_BLASTMINE ]			= [3]; //trap
	CastSize[ SkillId.PR_BENEDICTIO ]			= [3];
	CastSize[ SkillId.KO_ZENKAI ]				= [5];
	CastSize[ SkillId.WL_CRIMSONROCK ]			= [7];
	CastSize[ SkillId.GN_CRAZYWEED ]			= [9];
	CastSize[ SkillId.NPC_COMET ]				=		//NPC VERSION of the following
	CastSize[ SkillId.WL_COMET ]				= [19];
	//CastSize[ SkillId.RA_COBALTTRAP ]			= [5]; //trap
	CastSize[ SkillId.HT_CLAYMORETRAP ]			= [5];
	CastSize[ SkillId.SC_CHAOSPANIC ]			= [5];
	//CastSize[ SkillId.SU_CN_METEOR ]			= [3,3,5,5,7]; //Skill not implemented yet
	CastSize[ SkillId.RK_DRAGONBREATH_WATER ]	= [3,3,3,5,5,5,7,7,9,9];
	CastSize[ SkillId.RK_DRAGONBREATH ]			= [3,3,3,5,5,5,7,7,9,9];
	//CastSize[ SkillId.WM_DOMINION_IMPULSE ]		= [11]; // 11 long cone??
	CastSize[ SkillId.SC_DIMENSIONDOOR ]		= [1];
	CastSize[ SkillId.SO_DIAMONDDUST ]			= [7,7,7,9,9];
	CastSize[ SkillId.HT_DETECTING ]			= [3];
	CastSize[ SkillId.GN_DEMONIC_FIRE ]			= [5];
	CastSize[ SkillId.SA_DELUGE ]				= [7];
	CastSize[ SkillId.SO_VACUUM_EXTREME ]		= [3,3,5,5,7];
	CastSize[ SkillId.NPC_EVILLAND ]			= [11];
	CastSize[ SkillId.AB_EPICLESIS ]			= [5];
	//CastSize[ SkillId.RA_ELECTRICSHOCKER ]	= [5]; //trap
	CastSize[ SkillId.SO_EARTH_INSIGNIA ]		= [3];
	CastSize[ SkillId.SO_EARTHGRAVE ]			= [7,7,7,9,9];
	//CastSize[ SkillId.HT_FREEZINGTRAP ]		= [3]; //trap
	CastSize[ SkillId.HT_FLASHER ]				= [3];
	CastSize[ SkillId.MG_FIREWALL ]				= [1];
	CastSize[ SkillId.RA_FIRINGTRAP ]			= [5];
	//CastSize[ SkillId.RL_FIRE_RAIN ]			= [3]; //?? 3x11 cone
	//CastSize[ SkillId.WZ_FIREPILLAR ]			= [3,3,3,3,3,7,7,7,7,7]; //trap
	CastSize[ SkillId.SO_FIRE_INSIGNIA ]		= [3];
	CastSize[ SkillId.GN_FIRE_EXPANSION ]		= [5];
	//CastSize[ SkillId.RL_H_MINE ]				= [5]; //trap
	CastSize[ SkillId.GN_HELLS_PLANT ]			= [3];
	CastSize[ SkillId.WZ_HEAVENDRIVE ]			= [5];
	CastSize[ SkillId.HW_GRAVITATION ]			= [5];
	CastSize[ SkillId.RL_HAMMER_OF_GOD ]		= [5];
	CastSize[ SkillId.NPC_RAYOFGENESIS ]		=		//NPC VERSION of the following
	CastSize[ SkillId.LG_RAYOFGENESIS ]			= [11];
	CastSize[ SkillId.HW_GANBANTEIN ]			= [3];
	//CastSize[ SkillId.RA_ICEBOUNDTRAP ]		= [5]; //trap
	CastSize[ SkillId.NC_COLDSLOWER ]			= [5,7,9];
	CastSize[ SkillId.WZ_VERMILION ]			= [11];
	CastSize[ SkillId.SR_RIDEINLIGHTNING ]		= [3,3,5,5,7];
	CastSize[ SkillId.NJ_RAIGEKISAI ]			= [3,3,5,5,7];
	CastSize[ SkillId.MH_LAVA_SLIDE ]			= [3,3,3,5,5,5,7,7,7,9];
	CastSize[ SkillId.NPC_MAGMA_ERUPTION ]		=		//NPC VERSION of the following
	CastSize[ SkillId.NC_MAGMA_ERUPTION ]		= [7];
	CastSize[ SkillId.KO_BAKURETSU ]			= [3];
	CastSize[ SkillId.NPC_CLOUD_KILL ]			=		//NPC VERSION of the following
	CastSize[ SkillId.SO_CLOUD_KILL ]			= [7];
	CastSize[ SkillId.WZ_METEOR ]				= [7];
	//CastSize[ SkillId.RA_MAIZETRAP ]			= [5]; //trap
	CastSize[ SkillId.SC_MANHOLE ]				= [3];
	CastSize[ SkillId.PR_MAGNUS ]				= [7];
	CastSize[ SkillId.SA_LANDPROTECTOR ]		= [7,7,9,9,11];
	//CastSize[ SkillId.RA_MAGENTATRAP ]		= [5]; //trap
	CastSize[ SkillId.SC_MAELSTROM ]			= [5];
	CastSize[ SkillId.KO_MUCHANAGE ]			= [3,3,3,3,3,3,3,3,5];
	CastSize[ SkillId.WZ_QUAGMIRE ]				= [5];
	CastSize[ SkillId.NPC_PSYCHIC_WAVE ]		= 		//NPC VERSION of the following
	CastSize[ SkillId.SO_PSYCHIC_WAVE ]			= [7,7,9,9,11];
	CastSize[ SkillId.GC_POISONSMOKE ]			= [5];
	CastSize[ SkillId.MH_POISON_MIST ]			= [7];
	CastSize[ SkillId.AL_PNEUMA ]				= [3];
	//CastSize[ SkillId.CD_PNEUMATICUS_PROCELLA ]	= [5,5,5,7,7,7,9,9,9,11]; //Not implemented yet
	CastSize[ SkillId.LG_OVERBRAND ]			= [3];
	//CastSize[ SkillId.SU_NYANGGRASS ]			= [5,5,7,7,9]; //Not implemented yet
	CastSize[ SkillId.WM_SEVERE_RAINSTORM ]		= [11];
	CastSize[ SkillId.RG_GRAFFITI ]				= [5];
	//CastSize[ SkillId.GM_SANDMAN ]			=		//Admin VERSION of the following
	//CastSize[ SkillId.MA_SANDMAN ]			=		//??? VERSION of the following
	//CastSize[ SkillId.HT_SANDMAN ]			= [3]; //trap
	CastSize[ SkillId.PR_SANCTUARY ]			= [5];
	CastSize[ SkillId.MG_THUNDERSTORM ]			= [5];
	//CastSize[ SkillId.GN_THORNS_TRAP ]		= [3]; //trap
	CastSize[ SkillId.WZ_STORMGUST ]			= [11];
	CastSize[ SkillId.WM_SOUND_OF_DESTRUCTION ]	= [9,9,11,13,15];
	CastSize[ SkillId.WM_POEMOFNETHERWORLD ]	= [3];
	CastSize[ SkillId.MH_XENO_SLASHER ]			= [3,3,3,5,5,5,7,7,7,9];
	CastSize[ SkillId.SO_WIND_INSIGNIA ]		= [3];
	CastSize[ SkillId.SA_VIOLENTGALE ]			= [7];
	CastSize[ SkillId.NJ_SUITON ]				= [3,3,3,5,5,5,7,7,7,9];
	CastSize[ SkillId.SO_WATER_INSIGNIA ]		= [3];
	CastSize[ SkillId.SO_WARMER ]				= [7];
	CastSize[ SkillId.SA_VOLCANO ]				= [7];
	CastSize[ SkillId.MH_VOLCANIC_ASH ]			= [3];
	//CastSize[ SkillId.RA_VERDURETRAP ]		= [5]; //trap
	CastSize[ SkillId.AS_VENOMDUST ]			= [2];
	CastSize[ SkillId.KO_HUUMARANKA ]			= [7];

	/**
	 * @var {string} Vertex Shader
	 */
	var _vertexShader   = `
		#version 100
		#pragma vscode_glsllint_stage : vert
		precision highp float;
		
		attribute vec3 aPosition;
		attribute vec2 aTextureCoord;

		varying vec2 vTextureCoord;
		
		uniform float uCameraLatitude;

		uniform mat4 uModelViewMat;
		uniform mat4 uProjectionMat;
		uniform mat4 uRotationMat;

		void main(void) {
			gl_Position    = uProjectionMat * uModelViewMat * vec4( aPosition, 1.0);
			gl_Position.z -= 0.02 / uCameraLatitude;

			vTextureCoord  = (uRotationMat * vec4( aTextureCoord - 0.5, 1.0, 1.0)).xy + 0.5;
		}
	`;


	/**
	 * @var {string} Fragment Shader
	 */
	var _fragmentShader = `
		#version 100
		#pragma vscode_glsllint_stage : frag
		precision highp float;

		varying vec2 vTextureCoord;

		uniform sampler2D uDiffuse;

		uniform bool  uFogUse;
		uniform float uFogNear;
		uniform float uFogFar;
		uniform vec3  uFogColor;

		void main(void) {
			vec4 texture = texture2D( uDiffuse,  vTextureCoord.st );

			if (texture.a == 0.0) {
				discard;
			}

            if (texture.r < 0.1 || texture.g < 0.1 || texture.b < 0.1) {
               discard;
            }

			gl_FragColor = texture;

			if (uFogUse) {
				float depth     = gl_FragCoord.z / gl_FragCoord.w;
				float fogFactor = smoothstep( uFogNear, uFogFar, depth );
				gl_FragColor    = mix( gl_FragColor, vec4( uFogColor, gl_FragColor.w ), fogFactor );
			}
		}
	`;

	/**
	 * MagicTarget constructor
	 *
	 * @param {number} position x
	 * @param {number} position y
	 * @param {number} cast size
	 * @param {number} tick to remove it
	 */
	function MagicTarget( id, x, y, endTick, srcEntity)
	{
		this.x           = x;
		this.y           = y;

		//A hacky way to read the last skill level and ring size. The official client does the same thing, unless they add a packet that tells the skill level directly.
		if( CastSize[id] ){
			if( Session.Entity == srcEntity && id == Session.Entity.lastSKID  && Session.Entity.lastSkLvl && CastSize[id].length >= Session.Entity.lastSkLvl ){
				this.size = CastSize[id][ Session.Entity.lastSkLvl - 1 ] || 1;
			} else {
				this.size = CastSize[id][0] || 1;
			}
		} else {
			this.size = 1;
		}

		this.endTick = endTick;
	}


	/**
	 * Preparing for render
	 *
	 * @param {object} webgl context
	 */
	MagicTarget.prototype.init = function init( gl )
	{
		var data       = Altitude.generatePlane( this.x, this.y, this.size);
		this.buffer    = gl.createBuffer();
		this.vertCount = data.length / 5;

		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
		gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );

		this.ready  = true;
	};


	/**
	 * Destroying data
	 *
	 * @param {object} webgl context
	 */
	MagicTarget.prototype.free = function free( gl )
	{
		gl.deleteBuffer(this.buffer);
		this.ready = false;
	};


	/**
	 * Rendering cast
	 *
	 * @param {object} wegl context
	 */
	MagicTarget.prototype.render = function render( gl, tick )
	{
		var attribute = _program.attribute;

		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
		
		gl.uniform1f( _program.uniform.uCameraLatitude, Camera.getLatitude() );

		gl.vertexAttribPointer( attribute.aPosition,     3, gl.FLOAT, false, 5*4,  0   );
		gl.vertexAttribPointer( attribute.aTextureCoord, 2, gl.FLOAT, false, 5*4,  3*4 );
		gl.drawArrays( gl.TRIANGLES, 0, this.vertCount );

		this.needCleanUp = this.endTick < tick;
	};





	/**
	 * Initialize effect
	 *
	 * @param {object} webgl context
	 */
	MagicTarget.init = function init(gl)
	{
		_program = WebGL.createShaderProgram( gl, _vertexShader, _fragmentShader );

		Client.loadFile('data/texture/effect/magic_target.tga', function(buffer) {
			WebGL.texture( gl, buffer, function(texture) {
				_texture = texture;
				MagicTarget.ready = true;
			});
		});
	};


	/**
	 * @var {boolean} should we render it before entities ?
	 */
	MagicTarget.renderBeforeEntities = true;


	/**
	 * Destroy objects
	 *
	 * @param {object} webgl context
	 */
	MagicTarget.free = function free(gl)
	{
		if (_texture) {
			gl.deleteTexture(_texture);
			_texture = null;
		}

		if (_program) {
			gl.deleteProgram(_program);
			_program = null;
		}

		this.ready = false;
	};


	/**
	 * Before render, set up program
	 *
	 * @param {object} webgl context
	 */
	MagicTarget.beforeRender = function beforeRender(gl, modelView, projection, fog, tick)
	{
		var uniform   = _program.uniform;
		var attribute = _program.attribute;

		mat4.identity(_matrix);
		mat4.rotateZ( _matrix, _matrix, (tick/1000*40) / 180 * Math.PI);

		gl.useProgram( _program );

		// Bind matrix
		gl.uniformMatrix4fv( uniform.uModelViewMat,  false, modelView );
		gl.uniformMatrix4fv( uniform.uProjectionMat, false, projection );
		gl.uniformMatrix4fv( uniform.uRotationMat,   false, _matrix);

		// Fog settings
		gl.uniform1i(  uniform.uFogUse,   fog.use && fog.exist );
		gl.uniform1f(  uniform.uFogNear,  fog.near );
		gl.uniform1f(  uniform.uFogFar,   fog.far  );
		gl.uniform3fv( uniform.uFogColor, fog.color );

		// Texture
		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, _texture );
		gl.uniform1i( uniform.uDiffuse, 0 );

		// Enable all attributes
		gl.enableVertexAttribArray( attribute.aPosition );
		gl.enableVertexAttribArray( attribute.aTextureCoord );
	};


	/**
	 * After render, clean attributes
	 *
	 * @param {object} webgl context
	 */
	MagicTarget.afterRender = function afterRender(gl)
	{
		gl.disableVertexAttribArray( _program.attribute.aPosition );
		gl.disableVertexAttribArray( _program.attribute.aTextureCoord );
	};


	/**
	 * Export
	 */
	return MagicTarget;
});

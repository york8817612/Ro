define(['Utils/WebGL', 'Core/Client', 'Renderer/SpriteRenderer', 'Renderer/EntityManager', 'Renderer/Map/Altitude', 'Renderer/Camera'], 
function (WebGL, Client, SpriteRenderer, EntityManager, Altitude, Camera) {
	'use strict';

	function randBetween(minimum, maximum) {
		return parseFloat(Math.min(minimum + Math.random() * (maximum - minimum), maximum).toFixed(3));
	}
	
	var blendMode = {};

	function ThreeDEffect(effect, EF_Inst_Par, EF_Init_Par) {
		var position = EF_Inst_Par.position;
		var otherPosition = EF_Inst_Par.otherPosition;
		var startTick = EF_Inst_Par.startTick;
		var endTick = EF_Inst_Par.endTick;
		var AID = EF_Init_Par.ownerAID;
		
		this.AID = AID;
		this.ownerEntity = EF_Init_Par.ownerEntity;
		this.otherEntity = EF_Init_Par.otherEntity;
		
		this.textureName = effect.file;
		
		this.textureNameList = Array.isArray(effect.fileList) ? effect.fileList : [] ;
		this.frameDelay = (!isNaN(effect.frameDelay)) ? effect.frameDelay : 10 ;
		
		this.zIndex = effect.zIndex ? effect.zIndex : 0;
		this.fadeOut = effect.fadeOut ? true : false;
		this.fadeIn = effect.fadeIn ? true : false;
		this.shadowTexture = effect.shadowTexture ? true : false;
		this.spriteName = effect.spriteName;
		this.spriteRessource = null;
		this.playSprite = effect.playSprite ? true : false;
		this.sprDelay = effect.sprDelay ? effect.sprDelay : 0;
		if (effect.rotatePosX > 0) this.rotatePosX = effect.rotatePosX;
		else this.rotatePosX = 0;
		if (effect.rotatePosY > 0) this.rotatePosY = effect.rotatePosY;
		else this.rotatePosY = 0;
		if (effect.rotatePosZ > 0) this.rotatePosZ = effect.rotatePosZ;
		else this.rotatePosZ = 0;
		if (effect.nbOfRotation > 0) this.nbOfRotation = effect.nbOfRotation;
		else this.nbOfRotation = 1;

		this.rotateLate =  (effect.rotateLate > 0) ? effect.rotateLate : 0;
		this.rotateLate += (effect.rotateLateDelta) ?  effect.rotateLateDelta * EF_Inst_Par.duplicateID : 0;

		this.rotationClockwise = effect.rotationClockwise ? true : false;
		this.sparkling = effect.sparkling ? true : false;
		if (effect.sparkNumber > 0){
			this.sparkNumber = effect.sparkNumber;
		} else{
			if(effect.sparkNumberRand){
				this.sparkNumber = randBetween(effect.sparkNumberRand[0], effect.sparkNumberRand[1]);
			}else{
				this.sparkNumber = 1;
			}	
		}
		
		this.alphaMax = (!isNaN(effect.alphaMax)) ? Math.max(Math.min(effect.alphaMax, 1), 0) : 1;
		this.alphaMax = Math.max(Math.min(this.alphaMax + (!isNaN(effect.alphaMaxDelta) ? effect.alphaMaxDelta * EF_Inst_Par.duplicateID : 0), 1), 0);

		if (effect.red) this.red = effect.red;
		else this.red = 1;
		if (effect.green) this.green = effect.green;
		else this.green = 1;
		if (effect.blue) this.blue = effect.blue;
		else this.blue = 1;
		this.position = position;
		if (effect.posxStart) this.posxStart = effect.posxStart;
		else this.posxStart = 0;
		if (effect.posxEnd) this.posxEnd = effect.posxEnd;
		else this.posxEnd = 0;
		if (effect.posx) {
			this.posxStart = effect.posx;
			this.posxEnd = effect.posx;
		}
		if (effect.posxRand) {
			this.posxStart = randBetween(-effect.posxRand, effect.posxRand);
			this.posxEnd = this.posxStart;
		}
		if (effect.posxRandDiff) {
			this.posxStart = randBetween(-effect.posxRandDiff, effect.posxRandDiff);
			this.posxEnd = randBetween(-effect.posxRandDiff, effect.posxRandDiff);
		}
		if (effect.posxStartRand) {
			var posxStartRandMiddle = effect.posxStartRandMiddle ? effect.posxStartRandMiddle : 0;
			this.posxStart = randBetween(posxStartRandMiddle - effect.posxStartRand, posxStartRandMiddle + effect.posxStartRand);
		}
		if (effect.posxEndRand) {
			var posxEndRandMiddle = effect.posxEndRandMiddle ? effect.posxEndRandMiddle : 0;
			this.posxEnd = randBetween(posxEndRandMiddle - effect.posxEndRand, posxEndRandMiddle + effect.posxEndRand);
		}
		this.posxSmooth = effect.posxSmooth ? true : false;
		if (effect.posyStart) this.posyStart = effect.posyStart;
		else this.posyStart = 0;
		if (effect.posyEnd) this.posyEnd = effect.posyEnd;
		else this.posyEnd = 0;
		if (effect.posy) {
			this.posyStart = effect.posy;
			this.posyEnd = effect.posy;
		}
		if (effect.posyRand) {
			this.posyStart = randBetween(-effect.posyRand, effect.posyRand);
			this.posyEnd = this.posyStart;
		}
		if (effect.posyRandDiff) {
			this.posyStart = randBetween(-effect.posyRandDiff, effect.posyRandDiff);
			this.posyEnd = randBetween(-effect.posyRandDiff, effect.posyRandDiff);
		}
		if (effect.posyStartRand) {
			var posyStartRandMiddle = effect.posyStartRandMiddle ? effect.posyStartRandMiddle : 0;
			this.posyStart = randBetween(posyStartRandMiddle - effect.posyStartRand, posyStartRandMiddle + effect.posyStartRand);
		}
		if (effect.posyEndRand) {
			var posyEndRandMiddle = effect.posyEndRandMiddle ? effect.posyEndRandMiddle : 0;
			this.posyEnd = randBetween(posyEndRandMiddle - effect.posyEndRand, posyEndRandMiddle + effect.posyEndRand);
		}
		this.posySmooth = effect.posySmooth ? true : false;
		if (effect.poszStart) this.poszStart = effect.poszStart;
		else this.poszStart = 0;
		if (effect.poszEnd) this.poszEnd = effect.poszEnd;
		else this.poszEnd = 0;
		if (effect.posz) {
			this.poszStart = effect.posz;
			this.poszEnd = effect.posz;
		}
		if (effect.poszRand) {
			this.poszStart = randBetween(-effect.poszRand, effect.poszRand);
			this.poszEnd = this.poszStart;
		}
		if (effect.poszRandDiff) {
			this.poszStart = randBetween(-effect.poszRandDiff, effect.poszRandDiff);
			this.poszEnd = randBetween(-effect.poszRandDiff, effect.poszRandDiff);
		}
		if (effect.poszStartRand) {
			var poszStartRandMiddle = effect.poszStartRandMiddle ? effect.poszStartRandMiddle : 0;
			this.poszStart = randBetween(poszStartRandMiddle - effect.poszStartRand, poszStartRandMiddle + effect.poszStartRand);
		}
		if (effect.poszEndRand) {
			var poszEndRandMiddle = effect.poszEndRandMiddle ? effect.poszEndRandMiddle : 0;
			this.poszEnd = randBetween(poszEndRandMiddle - effect.poszEndRand, poszEndRandMiddle + effect.poszEndRand);
		}
		
		this.xOffset = (!isNaN(effect.xOffset)) ? effect.xOffset : 0;
		this.yOffset = (!isNaN(effect.yOffset)) ? effect.yOffset : 0;
		this.zOffset = (!isNaN(effect.zOffset)) ? effect.zOffset : 0;
		
		this.poszSmooth = effect.poszSmooth ? true : false;
		if (effect.fromSrc) {
			var randStart = [
					effect.posxStartRand ? randBetween(-effect.posxStartRand, effect.posxStartRand) : 0,
					effect.posyStartRand ? randBetween(-effect.posyStartRand, effect.posyStartRand) : 0,
					effect.poszStartRand ? randBetween(-effect.poszStartRand, effect.poszStartRand) : 0
				];
			var randEnd = [
					effect.posxEndRand ? randBetween(-effect.posxEndRand, effect.posxEndRand) : 0,
					effect.posyEndRand ? randBetween(-effect.posyEndRand, effect.posyEndRand) : 0,
					effect.poszEndRand ? randBetween(-effect.poszEndRand, effect.poszEndRand) : 0
				];
			
			this.posxStart = 0 + this.xOffset + randStart[0];
			this.posxEnd = (otherPosition[0] - position[0]) + this.xOffset + randEnd[0];
			this.posyStart = 0 + this.yOffset + randStart[1];
			this.posyEnd = (otherPosition[1] - position[1]) + this.yOffset + randEnd[1];
			this.poszStart = 0 + this.zOffset + randStart[2];
			this.poszEnd = (otherPosition[2] - position[2]) + this.zOffset + randEnd[2];
		}
		if (effect.toSrc) {
			var randStart = [
					effect.posxStartRand ? randBetween(-effect.posxStartRand, effect.posxStartRand) : 0,
					effect.posyStartRand ? randBetween(-effect.posyStartRand, effect.posyStartRand) : 0,
					effect.poszStartRand ? randBetween(-effect.poszStartRand, effect.poszStartRand) : 0
				];
			var randEnd = [
					effect.posxEndRand ? randBetween(-effect.posxEndRand, effect.posxEndRand) : 0,
					effect.posyEndRand ? randBetween(-effect.posyEndRand, effect.posyEndRand) : 0,
					effect.poszEndRand ? randBetween(-effect.poszEndRand, effect.poszEndRand) : 0
				];
			
			this.posxStart = (otherPosition[0] - position[0]) + this.xOffset + randStart[0];
			this.posxEnd = 0 + this.xOffset + randEnd[0];
			this.posyStart = (otherPosition[1] - position[1]) + this.yOffset + randStart[1];
			this.posyEnd = 0 + this.yOffset + randEnd[1];
			this.poszStart = (otherPosition[2] - position[2]) + this.zOffset + randStart[2];
			this.poszEnd = 0 + this.zOffset + randEnd[2];

		}

		if (effect.size) {
			this.sizeStartX = effect.size;
			this.sizeStartY = effect.size;
			this.sizeEndX = effect.size;
			this.sizeEndY = effect.size;
		} else {
			this.sizeStartX = 1;
			this.sizeStartY = 1;
			this.sizeEndX = 1;
			this.sizeEndY = 1;
		}

		if(effect.sizeDelta){
			this.sizeStartX += effect.sizeDelta * EF_Inst_Par.duplicateID;
			this.sizeStartY += effect.sizeDelta * EF_Inst_Par.duplicateID;
			this.sizeEndX += effect.sizeDelta * EF_Inst_Par.duplicateID;
			this.sizeEndY += effect.sizeDelta * EF_Inst_Par.duplicateID;
		}

		if (effect.sizeStart) {
			this.sizeStartX = effect.sizeStart;
			this.sizeStartY = effect.sizeStart;
		}
		if (effect.sizeEnd) {
			this.sizeEndX = effect.sizeEnd;
			this.sizeEndY = effect.sizeEnd;
		}
		if (effect.sizeX) {
			this.sizeStartX = effect.sizeX;
			this.sizeEndX = effect.sizeX;
		}
		if (effect.sizeY) {
			this.sizeStartY = effect.sizeY;
			this.sizeEndY = effect.sizeY;
		}
		if (effect.sizeStartX) this.sizeStartX = effect.sizeStartX;
		if (effect.sizeStartY) this.sizeStartY = effect.sizeStartY;
		if (effect.sizeEndX) this.sizeEndX = effect.sizeEndX;
		if (effect.sizeEndY) this.sizeEndY = effect.sizeEndY;
		if (effect.sizeRand) {
			this.sizeStartX = effect.size + randBetween(-effect.sizeRand, effect.sizeRand);
			this.sizeStartY = this.sizeStartX;
			this.sizeEndX = this.sizeStartX;
			this.sizeEndY = this.sizeStartX;
		}
		if (effect.sizeRandX) {
			var sizeRandXMiddle = effect.sizeRandXMiddle ? effect.sizeRandXMiddle : 100;
			this.sizeStartX = randBetween(sizeRandXMiddle - effect.sizeRandX, sizeRandXMiddle + effect.sizeRandX);
			this.sizeEndX = this.sizeStartX;
		}
		if (effect.sizeRandY) {
			var sizeRandYMiddle = effect.sizeRandYMiddle ? effect.sizeRandYMiddle : 100;
			this.sizeStartY = randBetween(sizeRandYMiddle - effect.sizeRandY, sizeRandYMiddle + effect.sizeRandY);
			this.sizeEndY = this.sizeStartY;
		}
		this.sizeSmooth = effect.sizeSmooth ? true : false;
		this.angle = effect.angle ? effect.angle : 0;
		this.rotate = effect.rotate ? true : false;
		this.toAngle = effect.toAngle ? effect.toAngle : 0;
		if (this.shadowTexture && 0) {
			var GroundEffect = require('Renderer/Effects/GroundEffect');
			require('Renderer/EffectManager').add(new GroundEffect(this.posxStart, this.posyStart), 1000000);
		}
		this.startTick = startTick;
		this.endTick = endTick;
		
		this.blendMode = effect.blendMode;
		
		if(effect.rotateToTarget){
			this.rotateToTarget = true;
			var x = this.posxEnd - this.posxStart;
			var y = this.posyEnd - this.posyStart;
			this.angle += (90 - (Math.atan2(y, x) * (180 / Math.PI)));
		}
		
		this.rotateWithCamera = effect.rotateWithCamera ? true : false;
	}
	
	
	ThreeDEffect.prototype.init = function init(gl) {
		this.loadedTextures = 0;
		this.textureList = [];
		var self = this;
		if(this.textureNameList.length > 0){
			var textureCount = this.textureNameList.length;
			
			for (let i=0; i<textureCount; i++){
				Client.loadFile('data/texture/' + this.textureNameList[i], function (buffer) {
					WebGL.texture(gl, buffer, function (texture) {
						self.textureList[i] = texture;
						self.loadedTextures++;
						
						if(self.loadedTextures == textureCount){
							self.ready = true;
						}
					});
				});
			}
		} else if (this.textureName) {
			Client.loadFile('data/texture/' + this.textureName, function (buffer) {
				WebGL.texture(gl, buffer, function (texture) {
					self.texture = texture;
					self.ready = true;
				});
			});
		} else {
			self.ready = true;
		}
	};
	
	
	ThreeDEffect.prototype.free = function free(gl) {
		this.ready = false;
	};
	
	ThreeDEffect.prototype.render = function render(gl, tick) {
		
		if( this.startTick > tick ) return; //not yet
		
		if (this.blendMode > 0 && this.blendMode < 16) {
			gl.blendFunc(gl.SRC_ALPHA, blendMode[this.blendMode]);
		} else {
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
		
		var start = tick - this.startTick;
		var end = this.endTick - this.startTick;
		var steps = start / end * 100;
		
		if (steps > 100) steps = 100;
		
		if (!this.spriteRessource) {
			if (this.shadowTexture) {
				this.spriteRessource = Client.loadFile('data/sprite/shadow.spr');
				this.actRessource = Client.loadFile('data/sprite/shadow.act');
			} else if (this.spriteName) {
				this.spriteRessource = Client.loadFile('data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/' + this.spriteName + '.spr');
				this.actRessource = Client.loadFile('data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/' + this.spriteName + '.act');
			}
		}
		
		if (this.spriteRessource) {
			this.texture = this.spriteRessource.frames[0].texture;
		}
		
		if(this.textureList.length > 0){
			let frame = Math.floor((tick - this.startTick) / this.frameDelay) % this.textureList.length;
			this.texture = this.textureList[frame];
		}
		
		SpriteRenderer.image.texture = this.texture;
		SpriteRenderer.zIndex = this.zIndex;
		
		var posDelta = 0;
		
		if (this.rotatePosX > 0) {
			posDelta = this.rotatePosX * Math.cos(steps * 3.5 * this.nbOfRotation * Math.PI / 180 - this.rotateLate * Math.PI / 2);
			if (this.rotationClockwise) posDelta = -1 * posDelta;
		} else {
			if (this.posxSmooth) {
				if (this.posxStart != this.posxEnd) {
					var csJ = steps * 0.09 + 1;
					var csK = Math.log10(csJ);
					var csL = this.posxEnd - this.posxStart;
					var csM = this.posxStart;
					var csN = csK * csL + csM;
					posDelta = csN;
				} else posDelta = this.posxStart;
			} else {
				if (this.posxStart != this.posxEnd) {
					var csL = (this.posxEnd - this.posxStart) / 100;
					var csM = this.posxStart;
					var csN = steps * csL + csM;
					posDelta = csN;
				} else posDelta = this.posxStart;
			}
		}
		SpriteRenderer.position[0] = this.position[0] + posDelta;
		posDelta = 0;
		
		if (this.rotatePosY > 0) {
			posDelta = this.rotatePosY * Math.sin(steps * 3.5 * this.nbOfRotation * Math.PI / 180 - this.rotateLate * Math.PI / 2);
		} else {
			if (this.posySmooth) {
				if (this.posyStart != this.posyEnd) {
					var csJ = steps * 0.09 + 1;
					var csK = Math.log10(csJ);
					var csL = this.posyEnd - this.posyStart;
					var csM = this.posyStart;
					var csN = csK * csL + csM;
					posDelta = csN;
				} else posDelta = this.posyStart;
			} else {
				if (this.posyStart != this.posyEnd) {
					var csL = (this.posyEnd - this.posyStart) / 100;
					var csM = this.posyStart;
					var csN = steps * csL + csM;
					posDelta = csN;
				} else posDelta = this.posyStart;
			}
		}
		SpriteRenderer.position[1] = this.position[1] + posDelta;
		posDelta = 0;
		
		if (this.poszSmooth) {
			if (this.poszStart != this.poszEnd) {
				var csJ = steps * 0.09 + 1;
				var csK = Math.log10(csJ);
				var csL = this.poszEnd - this.poszStart;
				var csM = this.poszStart;
				var csN = csK * csL + csM;
				posDelta = csN;
			} else posDelta = this.poszStart;
		} else {
			if (this.poszStart != this.poszEnd) {
				var csL = (this.poszEnd - this.poszStart) / 100;
				var csM = this.poszStart;
				var csN = steps * csL + csM;
				posDelta = csN;
			} else posDelta = this.poszStart;
		}
		SpriteRenderer.position[2] = this.position[2] + posDelta;
		
		if (this.shadowTexture) SpriteRenderer.position[2] = Altitude.getCellHeight(SpriteRenderer.position[0], SpriteRenderer.position[0]);
		
		var alpha = this.alphaMax;
		
		if (this.fadeIn && start < end / 4) {
			alpha = start * this.alphaMax / (end / 4);
		} else if (this.fadeOut && start > end / 2 + end / 4) {
			alpha = (end - start) * this.alphaMax / (end / 4);
		} else if (this.sparkling) {
			alpha = this.alphaMax * ((Math.cos(steps * 11 * this.sparkNumber * Math.PI / 180) + 1) / 2);
		}
		
		if (alpha < 0) {
			alpha = 0.0;
		} else if (alpha > 1) {
			alpha = 1.0;
		}
		
		SpriteRenderer.color[3] = alpha;
		SpriteRenderer.color[0] = this.red;
		SpriteRenderer.color[1] = this.green;
		SpriteRenderer.color[2] = this.blue;
		var sizeX, sizeY;
		
		if (this.sizeSmooth) {
			if (this.sizeEndX != this.sizeStartX) {
				var csJ = steps * 0.09 + 1;
				var csK = Math.log10(csJ);
				var csL = this.sizeEndX - this.sizeStartX;
				var csM = this.sizeStartX;
				var csN = csK * csL + csM;
				sizeX = csN;
			} else sizeX = this.sizeStartX;
			if (this.sizeEndY != this.sizeStartY) {
				var ctf = steps * 0.09 + 1;
				var ctg = Math.log10(ctf);
				var cth = this.sizeEndY - this.sizeStartY;
				var cti = this.sizeStartY;
				var ctj = ctg * cth + cti;
				sizeY = ctj;
			} else sizeY = this.sizeStartY;
		} else {
			if (this.sizeEndX != this.sizeStartX) {
				var csL = (this.sizeEndX - this.sizeStartX) / 100;
				var csM = this.sizeStartX;
				var csN = steps * csL + csM;
				sizeX = csN;
			} else sizeX = this.sizeStartX;
			if (this.sizeEndY != this.sizeStartY) {
				var cth = (this.sizeEndY - this.sizeStartY) / 100;
				var cti = this.sizeStartY;
				var ctj = steps * cth + cti;
				sizeY = ctj;
			} else sizeY = this.sizeStartY;
		}
		
		SpriteRenderer.size[0] = sizeX;
		SpriteRenderer.size[1] = sizeY;
		
		if (this.rotate) {
			var angleStep = (this.toAngle - this.angle) / 100;
			var startAngle = this.angle;
			var angle = steps * angleStep + startAngle;
			SpriteRenderer.angle = this.rotateWithCamera ? angle + Camera.angle[1] : angle;
		} else {
			SpriteRenderer.angle = this.rotateWithCamera ? this.angle + Camera.angle[1] : this.angle;
		}
		
		if (this.shadowTexture && 0) {
			var effectName = require('Renderer/EffectManager').get(1000000);
			if (effectName) {
				if (this.endTick < tick) require('Renderer/EffectManager').remove(effectName, 1000000);
				else {
					effectName.position = new Int16Array([SpriteRenderer.position[0], SpriteRenderer.position[1], Altitude.getCellHeight(SpriteRenderer.position[0], SpriteRenderer.position[1])]);
				}
			}
		}
		
		if (this.actRessource && this.spriteRessource) {
			var entity = this.ownerEntity;
			if(!entity){
				var Entity		= require('Renderer/Entity/Entity');
				entity			= new Entity();
				entity.GID		= this.AID;
				entity.position   = this.position;
				entity.objecttype = entity.constructor.TYPE_EFFECT;
				entity.hideShadow = true;
				EntityManager.add(entity);
				this.ownerEntity = entity;
			}
			if (entity) {
				var actions = this.actRessource.actions[(entity.action * 8 + (Camera.direction + entity.direction + 8) % 8) % this.actRessource.actions.length];
				var animations;
				var delay = this.sprDelay || actions.delay;
				if (this.playSprite) animations = actions.animations[Math.floor((tick - this.startTick) / delay) % actions.animations.length];
				else animations = actions.animations[0];
				var layers = animations.layers;
				let i = 0;
				let layercount = layers.length;
				do {
					let renderer;
					
					if (i == 0) renderer = SpriteRenderer;
					else renderer = Object.assign({}, SpriteRenderer);
					
					var layer = layers[i];
					var ctE = new Int16Array(2);
					ctE[0] = 0;
					ctE[1] = 0;
					if (animations.pos.length) {
						ctE[0] = this.position[0] - animations.pos[0].x;
						ctE[1] = this.position[1] - animations.pos[0].y;
					}
					renderer.image.texture = this.spriteRessource.frames[layer.index].texture;
					renderer.image.palette = null;
					renderer.sprite = this.spriteRessource.frames[layer.index];
					renderer.palette = this.spriteRessource.palette;
					var ctF = layer.index + 0;
					var ctG = layer.spr_type === 1 || this.spriteRessource.rgba_index === 0;
					if (!ctG) {
						renderer.image.palette = this.spriteRessource.texture;
						renderer.image.size[0] = this.spriteRessource.frames[ctF].width;
						renderer.image.size[1] = this.spriteRessource.frames[ctF].height;
					} else if (layer.spr_type === 1) {
						ctF += this.spriteRessource.old_rgba_index;
					}
					var frame = this.spriteRessource.frames[ctF];
					var width = frame.width;
					var height = frame.height;
					width *= layer.scale[0] / 100 * sizeX;
					height *= layer.scale[1] / 100 * sizeY;
					if (layer.is_mirror) {
						width = -width;
					}
					renderer.color[0] *= layer.color[0];
					renderer.color[1] *= layer.color[1];
					renderer.color[2] *= layer.color[2];
					renderer.color[3] *= layer.color[3];
					if (!this.rotateToTarget) renderer.angle += layer.angle;
					renderer.offset[0] = layer.pos[0] + ctE[0];
					renderer.offset[1] = layer.pos[1] + ctE[1];
					renderer.size[0] = width;
					renderer.size[1] = height;
					renderer.render();
					++i;
				} while (i < layercount);
			}
		} else {
			SpriteRenderer.render();
		}
		
		this.needCleanUp = this.endTick < tick;
	};
	
	ThreeDEffect.init = function init(gl) {
		blendMode[1] = gl.ZERO;
		blendMode[2] = gl.ONE;
		blendMode[3] = gl.SRC_COLOR;
		blendMode[4] = gl.ONE_MINUS_SRC_COLOR;
		blendMode[5] = gl.DST_COLOR;
		blendMode[6] = gl.ONE_MINUS_DST_COLOR;
		blendMode[7] = gl.SRC_ALPHA;
		blendMode[8] = gl.ONE_MINUS_SRC_ALPHA;
		blendMode[9] = gl.DST_ALPHA;
		blendMode[10] = gl.ONE_MINUS_DST_ALPHA;
		blendMode[11] = gl.CONSTANT_COLOR;
		blendMode[12] = gl.ONE_MINUS_CONSTANT_COLOR;
		blendMode[13] = gl.CONSTANT_ALPHA;
		blendMode[14] = gl.ONE_MINUS_CONSTANT_ALPHA;
		blendMode[15] = gl.SRC_ALPHA_SATURATE;
		
		this.ready = true;
		this.renderBeforeEntities = false;
	};
	
	ThreeDEffect.free = function free(gl) {
		this.ready = false;
	};
	
	ThreeDEffect.beforeRender = function beforeRender(gl, modelView, projection, fog, tick) {
		gl.depthMask(false);
		SpriteRenderer.bind3DContext(gl, modelView, projection, fog);
		SpriteRenderer.shadow = 1;
		SpriteRenderer.angle = 0;
		SpriteRenderer.size[0] = 100;
		SpriteRenderer.size[1] = 100;
		SpriteRenderer.offset[0] = 0;
		SpriteRenderer.offset[1] = 0;
		SpriteRenderer.image.palette = null;
		SpriteRenderer.color[0] = 1;
		SpriteRenderer.color[1] = 1;
		SpriteRenderer.color[2] = 1;
		SpriteRenderer.color[3] = 1;
		SpriteRenderer.depth = 0;
		SpriteRenderer.zIndex = 0;
	};
	
	ThreeDEffect.afterRender = function afterRender(gl) {
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.depthMask(true);
		SpriteRenderer.unbind(gl);
	};
	return ThreeDEffect;
});

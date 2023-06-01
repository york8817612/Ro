/**
 * DB/Status/StatusState.js
 *
 * List of status state
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

define(['DB/Status/StatusConst'], function(StatusConst) {

	"use strict";

	return {

		BodyState: {
			STONE        : 1,
			FREEZE       : 2,
			STUN         : 3,
			SLEEP        : 4,
			STONEWAIT    : 6,
			BURNING      : 7,
			IMPRISON     : 8,
			CRYSTALIZE   : 9,
		},

		HealthState: {
			POISON       : 0x0001,
			CURSE        : 0x0002,
			SILENCE      : 0x0004,
			SIGNUMCRUCIS : 0x0008,
			BLIND        : 0x0010,
			ANGELUS      : 0x0020,
			BLEEDING     : 0x0040,
			DPOISON      : 0x0080,
			FEAR         : 0x0100,
		},

		EffectState: {
			NOTHING      : 0x00000000,
			SIGHT        : 0x00000001,
			HIDE         : 0x00000002,
			CLOAK        : 0x00000004,
			FALCON       : 0x00000010,
			RIDING       : 0x00000020,
			INVISIBLE    : 0x00000040,
			ORCISH       : 0x00000800,
			WEDDING      : 0x00001000,
			RUWACH       : 0x00002000,
			CHASEWALK    : 0x00004000,
			FLYING       : 0x00008000,
			XMAS         : 0x00010000,
			TRANSFORM    : 0x00020000,
			SUMMER       : 0x00040000,
			DRAGON1      : 0x00080000,
			WUG          : 0x00100000,
			WUGRIDER     : 0x00200000,
			MADOGEAR     : 0x00400000,
			DRAGON2      : 0x00800000,
			DRAGON3      : 0x01000000,
			DRAGON4      : 0x02000000,
			DRAGON5      : 0x04000000,
			HANBOK       : 0x08000000,
			OKTOBERFEST  : 0x10000000,

			CART1        : 0x00000008,
			CART2        : 0x00000080,
			CART3        : 0x00000100,
			CART4        : 0x00000200,
			CART5        : 0x00000400,
		},

		OPT3: {
			NORMAL           : 0x00000000,
			QUICKEN          : 0x00000001,
			OVERTHRUST       : 0x00000002,
			ENERGYCOAT       : 0x00000004,
			EXPLOSIONSPIRITS : 0x00000008,
			STEELBODY        : 0x00000010,
			BLADESTOP        : 0x00000020,
			AURABLADE        : 0x00000040,
			BERSERK          : 0x00000080,
			LIGHTBLADE       : 0x00000100,
			MOONLIT          : 0x00000200,
			MARIONETTE       : 0x00000400,
			ASSUMPTIO        : 0x00000800,
			WARM             : 0x00001000,
			KAITE            : 0x00002000,
			BUNSIN           : 0x00004000,
			SOULLINK         : 0x00008000,
			UNDEAD           : 0x00010000,
			CONTRACT         : 0x00020000
		},

		Status: StatusConst
	};
});

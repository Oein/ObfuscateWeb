/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
var MAX_LEN_R36 = 10, // i.e. (Number.MAX_SAFE_INTEGER).toString(36).length - 1
	R36_BLOCKS_TABLE = [
		{ pattern: '[\\x00-\\x19]', offset: -97 },
		{ pattern: '[\\x1a-\\x2f]', offset: -71 },
		{ pattern: '[\\x3a-\\x53]', offset: -39 },
		{ pattern: '[\\x54-\\x60]', offset: -13 },
		{ pattern: '[\\x7b-\\x7f]', offset: 26 }
	],
	TPL_CHARCODE =
		'(function(){var @ID1@=Array.prototype.slice.call(arguments),@ID2@=@ID1@.shift();' +
		'return @ID1@.reverse().map(function(@ID3@,@ID4@){' +
		"return String.fromCharCode(@ID3@-@ID2@-@SHIFT2@-@ID4@)}).join('')})(@ARGS@)",
	TPL_OFFSET =
		".split('').map(function(@ID1@){" +
		"return String.fromCharCode(@ID1@.charCodeAt()+(@OFFSET@))}).join('')",
	reR36 = new RegExp(
		'([0-9a-z]{1,' +
			MAX_LEN_R36 +
			'})' +
			R36_BLOCKS_TABLE.map(function (block) {
				return '|(' + block.pattern + '{1,' + MAX_LEN_R36 + '})';
			}).join('') +
			'|([^\\x00-\\x7f]+)' /* invalid */,
		'g'
	),
	tryR36 = false;

function getIdPicker() {
	var ids = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	];
	return function () {
		// This error means that a bug exists in the caller. (picker should not be used over 52 times.)
		if (!ids.length) {
			throw new Error('getIdPicker');
		}
		return ids.splice(Math.floor(Math.random() * ids.length), 1)[0];
	};
}

// @ts-ignore
function escapePattern(pattern) {
	return pattern.replace(
		/[\x00-\x7f]/g, // eslint-disable-line no-control-regex

		// @ts-ignore
		function (s) {
			return '\\x' + ('00' + s.charCodeAt().toString(16)).substr(-2);
		}
	);
}

// @ts-ignore
function getCode4string(str, tryCompact) {
	var reNonAscii = /[^\x00-\x7f]/, // eslint-disable-line no-control-regex
		arrCode = [],
		maxLen,
		strPart,
		partLen;

	// @ts-ignore
	function getCodeWithCharCode(str) {
		var shift1 = Math.floor(Math.random() * 64), // 0..65
			shift2 = Math.floor(Math.random() * 64), // 0..65
			index = str.length,
			args = [],
			code = TPL_CHARCODE,
			idPicker = getIdPicker();

		while (--index > -1) {
			args.push(str.charCodeAt(index) + shift1 + shift2 + index);
		}
		args.unshift(shift1);

		return (
			code
				// @ts-ignore
				.replace(/@SHIFT2@/g, shift2)
				.replace(/@ARGS@/g, args.join(','))
				.replace(/@ID1@/g, idPicker())
				.replace(/@ID2@/g, idPicker())
				.replace(/@ID3@/g, idPicker())
				.replace(/@ID4@/g, idPicker())
		);
	}

	// @ts-ignore
	function getCodeWithR36(str) {
		var arrCode = [],
			// @ts-ignore
			matches;

		// @ts-ignore
		function getCodeWithR36Unit(str) {
			var leadingZeros = '';
			// @ts-ignore
			str.replace(/^(0+)(?=.)/, function (s, zeros) {
				leadingZeros = "'" + zeros + "'+";
				return '';
			});
			return leadingZeros + '(' + parseInt(str, 36) + ').toString(36).toLowerCase()';
		}

		// @ts-ignore
		function checkBlock(block, i) {
			var code, idPicker;
			// @ts-ignore
			if (matches[i + 2]) {
				code = TPL_OFFSET;
				idPicker = getIdPicker();
				arrCode.push(
					getCodeWithR36Unit(
						// @ts-ignore
						matches[i + 2]
							.split('')
							// @ts-ignore
							.map(function (chr) {
								return String.fromCharCode(chr.charCodeAt() - block.offset);
							})
							.join('')
					) + code.replace(/@OFFSET@/g, block.offset).replace(/@ID1@/g, idPicker())
				);
				return true;
			}
			return false;
		}

		while ((matches = reR36.exec(str))) {
			if (matches[1]) {
				// no offset
				arrCode.push(getCodeWithR36Unit(matches[1]));
			} else if (!R36_BLOCKS_TABLE.some(checkBlock) && matches[R36_BLOCKS_TABLE.length + 2]) {
				// This error means that a bug exists in the caller. (reNonAscii already checked it.)
				throw new Error('Invalid string(R36): ' + matches[R36_BLOCKS_TABLE.length + 2]);
			}
		}

		return arrCode.join('+');
	}

	str += '';
	if (!str) {
		return "''";
	}
	if (!tryCompact) {
		maxLen = Math.max(Math.floor(str.length / 2), 1);
	}

	while (str) {
		if (tryCompact) {
			strPart = str;
			str = '';
		} else {
			// @ts-ignore
			partLen = Math.floor(Math.random() * Math.min(maxLen, str.length)) + 1;
			strPart = str.substr(0, partLen);
			str = str.substr(partLen);
		}
		if (tryR36 && !reNonAscii.test(strPart)) {
			arrCode.push(getCodeWithR36(strPart));
			tryR36 = false;
		} else {
			arrCode.push(getCodeWithCharCode(strPart));
			tryR36 = true;
		}
	}

	return arrCode.join('+');
}

// @ts-ignore
function getCode4match(target, str) {
	var codeRe = false,
		index = 0,
		arrCode = [],
		maxLen,
		partLen;
	target += '';
	str += '';
	if (!str) {
		return target + "===''";
	}
	maxLen = Math.max(Math.floor(str.length / 2), 1);

	while (index < str.length) {
		partLen = Math.floor(Math.random() * Math.min(maxLen, str.length)) + 1;
		arrCode.push(
			codeRe
				? "(new RegExp('^[^]{" +
						index +
						"}'+" +
						getCode4string(escapePattern(str.substr(index, partLen)), true) +
						')).test(' +
						target +
						')'
				: '(' +
						target +
						').indexOf(' +
						getCode4string(str.substr(index, partLen), true) +
						',' +
						index +
						')===' +
						index
		);
		codeRe = !codeRe;
		index += partLen;
	}

	return arrCode.reverse().join('&&');
}

// @ts-ignore

const getCode = function (str: string): string {
	return (getCode4string as any)(str);
};

const mg = (a: string[]) => {
	let res_x = `[`;
	for (let i = 0; i < a.length; i++) {
		res_x += getCode(a[i]) + ',';
	}
	res_x += ']';
	return res_x;
};

export { mg, getCode };

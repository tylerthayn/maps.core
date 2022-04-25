/**
* Creates an Range.
* @class {array} Range
* @param {number} min
* @param {number} max
* @returns {Range}
*/
function Range (min, max) {
	let range = [ min < max ? min : max, min < max ? max : min ]

	/** @member {number} Range#min */
	Object.defineProperty(range, 'min', {enumerable: true, get: () => {return range[0]}})

	/** @member {number} Range#max */
	Object.defineProperty(range, 'max', {enumerable: true, get: () => {return range[1]}})

	/** @member {number} Range#center */
	Object.defineProperty(range, 'center', {enumerable: true, get: () => {return (range[1] - range[0]) / 2 + range[0]}})

	/** @member {number} Range#span */
	Object.defineProperty(range, 'span', {enumerable: true, get: () => {return Math.abs(Math.abs(range[1]) - Math.abs(range[0]))}})

	return range
}

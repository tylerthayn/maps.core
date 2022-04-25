/**
* @class PointBounds
* @param {Number|Point} minx - Min Point or min x value
* @param {Number|Point} miny - Max Point or min y value
* @param {Number} [maxx] - max x value
* @param {Number} [maxy] - max y value
*/
function PointBounds (minx, miny, maxx, maxy) {
	let bounds = []
	if (minx instanceof Point && miny instanceof Point) {
		bounds = [
			Math.min(minx.x, miny.x),
			Math.min(minx.y, miny.y),
			Math.max(minx.x, miny.x),
			Math.max(minx.y, miny.y)
		]
	} else {
		bounds = [
			Math.min(minx, maxx),
			Math.min(miny, maxy),
			Math.max(minx, maxx),
			Math.max(miny, maxy)
		]
	}

	/** @member {Number} PointBounds#minx */
	Object.defineProperty(bounds, 'minx', {enummerable: true, get: () => {return bounds[0]}})

	/** @member {Number} PointBounds#miny */
	Object.defineProperty(bounds, 'miny', {enummerable: true, get: () => {return bounds[1]}})

	/** @member {Number} PointBounds#maxx */
	Object.defineProperty(bounds, 'maxx', {enummerable: true, get: () => {return bounds[2]}})

	/** @member {Number} PointBounds#maxy */
	Object.defineProperty(bounds, 'maxy', {enummerable: true, get: () => {return bounds[3]}})

	/** @member {Point} PointBounds#min */
	Object.defineProperty(bounds, 'min', {enumerable: true, get: () => {return new Point(bounds.minx, bounds.miny)}})

	/** @member {Point} PointBounds#max */
	Object.defineProperty(bounds, 'max', {enumerable: true, get: () => {return new Point(bounds.maxx, bounds.maxy)}})

	/** @member {Range} PointBounds#x */
	Object.defineProperty(bounds, 'x', {enumerable: true, get: () => {return new Range(bounds.minx, bounds.maxy)}})

	/** @member {Range} PointBounds#y */
	Object.defineProperty(bounds, 'y', {enumerable: true, get: () => {return new Range(bounds.miny, bounds.maxy)}})

	/** @member {Point} PointBounds#center */
	Object.defineProperty(bounds, 'center', {enumerable: true, get: () => {
		return new Point(
			bounds.minx + (bounds.maxx - bounds.minx)/2,
			bounds.miny + (bounds.maxy - bounds.miny)/2
		)
	}})


	/**
	* @function Position
	* @memberof PointBounds
	* @param {Point|Point[]} point
	* @returns {Point|Point[]}
	*/
	Object.defineProperty(bounds, 'Position', {enumerable: true, value: function (point) {
		if (Array.isArray(point) && Array.isArray(point[0])) {
			let positions = []
			point.forEach(p => {
				positions.push(bounds.position(p))
			})
			return positions
		}

		if (Reflect.has(point, 'c') && Reflect.has(point, 'y')) {
			return new Point(
				(point.x - bounds.minx) / (bounds.maxx - bounds.minx),
				(point.y - bounds.miny) / (bounds.maxy - bounds.miny)
			)
		}
		if (Array.isArray(point)) {
			return new Point(
				(point[0] - bounds.minx) / (bounds.maxx - bounds.minx),
				(point[1] - bounds.miny) / (bounds.maxy - bounds.miny)
			)
		}
	}})

	return bounds
}

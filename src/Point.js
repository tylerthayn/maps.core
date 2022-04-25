/**
* Creates an (x,y,z) Point.
* @exports Point
* @class {Array.number} Point
* @param {number} x
* @param {number} y
* @param {number} [z]
* @returns {Point}
*/
function Point (x, y, z = 0) {
	let point = [x, y, z]

	/** @member {number} Point#x */
	Object.defineProperty(point, 'x', {get: () => {return point[0]}, enumerable: true})

	/** @member {number} Point#y */
	Object.defineProperty(point, 'y', {get: () => {return point[1]}, enumerable: true})

	/** @member {Number} Point#z */
	Object.defineProperty(point, 'z', {get: () => {return point[2]}, enumerable: true})

	/**
	* @function ToCoordinate
	* @memberof Point
	* @instance
	* @returns {Coordinate}
	*/
	Object.defineProperty(point, 'ToCoordinate', {enumerable: true, value: function () {
		let coordinate = GlobalMercator.MetersToLatLon(this.x, this.y)
		return new Coordinate(coordinate.lon, coordinate.lat, this.z)
	}})

	return point
}

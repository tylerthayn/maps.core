/**
* Creates an (lon, lat, ele) Coordinate.
* @exports Coordinate
* @class {Array.number} Coordinate
* @param {number} lon
* @param {number} lat
* @param {number} [ele=0]
* @returns {Coordinate}
*/
function Coordinate (lon, lat, ele = 0) {
	let coordinate = [lon, lat, ele]

	/** @member {number} Coordinate#lon */
	Object.defineProperty(coordinate, 'lon', {get: () => {return coordinate[0]}, enumerable: true})

	/** @member {number} Coordinate#lat */
	Object.defineProperty(coordinate, 'lat', {get: () => {return coordinate[1]}, enumerable: true})

	/** @member {number} Coordinate#ele */
	Object.defineProperty(coordinate, 'ele', {get: () => {return coordinate[2]}, enumerable: true})

	/** @function ToPoint
	* @memberof Coordinate
	* @instance
	* @returns {Point} */
	Object.defineProperty(coordinate, 'ToPoint', {enumerable: true, value: function () {
		let point = GlobalMercator.LatLonToMeters(this.lat, this.lon)
		return new Point(point.mx, point.my, this.ele)
	}})

	return coordinate
}

/**
* @function LonLat
* @memberof Coordinate
* @param {number} lon
* @param {number} lat
* @param {number} [ele=0]
* @returns {Coordinate}
* @static */
Object.defineProperty(Coordinate, 'LonLat', {enumerable: true, value: Coordinate})

/**
* @function LatLon
* @memberof Coordinate
* @param {number} lat
* @param {number} lon
* @param {number} [ele=0]
* @returns {Coordinate}
* @static */
Object.defineProperty(Coordinate, 'LatLon', {enumerable: true, value: (lat, lon, ele) => {
	return new Coordinate(lon, lat, ele)
}})

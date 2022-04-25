
/**
* @class CoordinateBounds
* @alias Bounds.Coordinate
* @param {Number|Coordinate} minlon - Min Coordinate or min lon value
* @param {Number|Coordinate} minlat - Max Coordinate or min lat value
* @param {Number} [maxlon] - max lon value
* @param {Number} [maxlat] - max lat value
* @returns {CoordinateBounds}
*/
function Bounds (minlon, minlat, maxlon, maxlat) {
	let bounds = []
	if (minlon instanceof Coordinate && minlat instanceof Coordinate) {
		bounds = [
			Math.min(minlon.lon, minlat.lon),
			Math.min(minlon.lat, minlat.lat),
			Math.max(minlon.lon, minlat.lon),
			Math.max(minlon.lat, minlat.lat)
		]
	} else {
		bounds = [
			Math.min(minlon, maxlon),
			Math.min(minlat, maxlat),
			Math.max(minlon, maxlon),
			Math.max(minlat, maxlat)
		]
	}

	/** @member {Number} CoordinateBounds#minlon */
	Object.defineProperty(bounds, 'minlon', {enummerable: true, get: () => {return bounds[0]}})

	/** @member {Number} CoordinateBounds#minlat */
	Object.defineProperty(bounds, 'minlat', {enummerable: true, get: () => {return bounds[1]}})

	/** @member {Number} CoordinateBounds#maxlon */
	Object.defineProperty(bounds, 'maxlon', {enummerable: true, get: () => {return bounds[2]}})

	/** @member {Number} CoordinateBounds#maxlat */
	Object.defineProperty(bounds, 'maxlat', {enummerable: true, get: () => {return bounds[3]}})

	/** @member {Coordinate} CoordinateBounds#min */
	Object.defineProperty(bounds, 'min', {enumerable: true, get: () => {return new Coordinate(bounds.minlon, bounds.minlat)}})

	/** @member {Coordinate} CoordinateBounds#max */
	Object.defineProperty(bounds, 'max', {enumerable: true, get: () => {return new Coordinate(bounds.maxlon, bounds.maxlat)}})

	/** @member {Range} CoordinateBounds#lon */
	Object.defineProperty(bounds, 'lon', {enumerable: true, get: () => {return new Range(bounds.minlon, bounds.maxlon)}})

	/** @member {Range} CoordinateBounds#lat */
	Object.defineProperty(bounds, 'lat', {enumerable: true, get: () => {return new Range(bounds.minlat, bounds.maxlat)}})

	/** @member {Coordinate} CoordinateBounds#center */
	Object.defineProperty(bounds, 'center', {enumerable: true, get: () => {
		return new Coordinate(bounds.lon.center, bounds.lat.center)
	}})

	Object.defineProperty(bounds, 'polyString', {enumerable: true, get: () => {
		let poly = [
			bounds.min.lat.toFixed(5),
			bounds.min.lon.toFixed(5),

			bounds.min.lat.toFixed(5),
			bounds.max.lon.toFixed(5),

			bounds.max.lat.toFixed(5),
			bounds.max.lon.toFixed(5),

			bounds.max.lat.toFixed(5),
			bounds.min.lon.toFixed(5)
		]
		return poly.join(' ')
	}})

	/**
	* @function Position
	* @memberof CoordinateBounds
	* @param {Coordinate|Coordinate[]} coordinate
	* @returns {Coordinate|Coordinate[]}
	*/
	Object.defineProperty(bounds, 'Position', {enumerable: true, value: function (coordinate) {
		if (Array.isArray(coordinate) && Array.isArray(coordinate[0])) {
			let positions = []
			coordinate.forEach(c => {
				positions.push(bounds.Position(c))
			})
			return positions
		}

		if (Reflect.has(coordinate, 'lon') && Reflect.has(coordinate, 'lat')) {
			return [
				(coordinate.lon - bounds.minlon) / (bounds.maxlon - bounds.minlon),
				(coordinate.lat - bounds.minlat) / (bounds.maxlat - bounds.minlat)
			]
		}
		if (Array.isArray(coordinate)) {
			return [
				(coordinate[0] - bounds.minlon) / (bounds.maxlon - bounds.minlon),
				(coordinate[1] - bounds.minlat) / (bounds.maxlat - bounds.minlat)
			]
		}
	}})

	Object.defineProperty(bounds, 'AsPolygon', {get: () => {
		return new Turf.polygon([[
			[bounds.min.lat.toFixed(5), bounds.min.lon.toFixed(5)],
			[bounds.min.lat.toFixed(5), bounds.max.lon.toFixed(5)],
			[bounds.max.lat.toFixed(5), bounds.max.lon.toFixed(5)],
			[bounds.max.lat.toFixed(5), bounds.min.lon.toFixed(5)],
			[bounds.min.lat.toFixed(5), bounds.min.lon.toFixed(5)]
		]])
	}})

	Object.defineProperty(bounds, 'Clip', {value: (feature) => {
		if (feature.type == 'FeatureCollection') {
			let clipped = {type: 'FeatureCollection', features: []}
			feature.features.forEach(f => {
				if (Turf.getType(f) == 'Point') {
					if (Turf.booleanPointInPolygon(f, bounds.AsPolygon)) {
						clipped.features.push(f)
					}
				} else {
					let c = Turf.bboxClip(f, bounds)
					if (Turf.getCoords(c).length > 0) {
						clipped.features.push(c)
					}
				}
			})
			return clipped
		} else {
			return Turf.bboxClip(feature, bounds)
		}
	}})

	Object.defineProperty(bounds, 'Tiles', {value: (zoom = 13) => {
		let tiles = []
		let min = new Tile(bounds.min, zoom)
		let max = new Tile(bounds.max, zoom)

		for (var y = max.slippy[2]; y<= min.slippy[2]; y++) {
			let row = []
			for (var x = min.slippy[1]; x<= max.slippy[1]; x++) {
				row.push(new Tile(zoom, x, y))
			}
			tiles.push(row)
		}
		return tiles
	}})


	return bounds
}

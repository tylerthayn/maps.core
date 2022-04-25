/*
https://opendata.gis.utah.gov/datasets/utah-major-streams-statewide/api
https://opendata.gis.utah.gov/datasets/utah-major-lakes/explore?location=38.557685%2C-111.831301%2C-1.00
https://opendata.gis.utah.gov/datasets/utah-springs-nhd/explore?location=38.591871%2C-111.929682%2C-1.00
https://opendata.gis.utah.gov/datasets/utah-streams-nhd/explore
*/

let ArcGIS = {
	DefaultParams: {
		where: '1=1',
		geometry: null,
		f: 'geojson',
		resultOffset: 0,
		resultRecordCount: 1000,
		outFields: '*',
		geometryType: 'esriGeometryEnvelope',
		idsOnly: false,
		outSR: '4326',
		inSR: '4326',
		spatialRel: 'esriSpatialRelEnvelopeIntersects'
	}
}

ArcGIS.Query = function (url, params, cb = null) {
	let qs = Object.keys(params).filter(key => params[key] != null).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
	if (!Reflect.has(params, 'resultOffset')) {params.resultOffset = 0}

	return new Promise((resolve, reject) => {
		if (https != null && geojsonStream != null) {
			/* NodeJs */
log(`${url}?${qs}`)
			https.get(`${url}?${qs}`, res => {
				if (res.statusCode !== 200) {return reject(new Error('Request Failed.\n' + `Status Code: ${res.statusCode}`))}
				res.setEncoding('utf8')
				let data = '', count = 0
				if (cb != null) {
					res.pipe(geojsonStream.parse((feature, index) => {
						count = index
						cb(Feature(feature), index)
					}))
				} else {
					res.on('data', chunk => {data += chunk.toString()})
				}
				res.on('end', () => {
					if (cb != null) {
						if (count > 0 && !Reflect.has(params, 'resultRecordCount')) {
							params.resultOffset += count
							ArcGIS.Query(url, params, cb).then(resolve).catch(reject)
						} else {
							resolve()
						}
					} else {
						let collection = JSON.parse(data)
						//if (collection.Get('features.length', 0) > 0 && collection.Get('features.length', 0) == params.resultRecordCount) {
						if (collection.Get('properties.exceededTransferLimit', false) === true) {
							params.resultOffset += collection.features.length
							ArcGIS.Query(url, params, cb).then((_collection) => {
								_collection.features.forEach(feature => {collection.features.push(feature)})
								resolve(FeatureCollection(collection))
							}).catch(reject)
						} else {
							resolve(FeatureCollection(collection))
						}
					}
				})
			})
		} else {
			/* Browser */
			fetch(url).then(res => res.text()).then(res => {
				let collection = JSON.parse(res)
				if (cb != null) {
					collection.features.forEach(feature => {cb(Feature(feature))})
				}
				if (collection.Get('properties.exceededTransferLimit', false) === true) {
					params.resultOffset += params.resultRecordCount
					ArcGIS.Query(url, params, cb).then(_collection => {
						_collection.features.forEach(feature => {collection.features.push(feature)})
						resolve(FeatureCollection(collection))
					}).catch(reject)
				} else {
					resolve(FeatureCollection(collection))
				}
			}).catch(reject)
		}
	})
}

ArcGIS.Lakes = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahMajorLakes/FeatureServer/0/query`, params, cb)
}

ArcGIS.LandOwnership = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://gis.trustlands.utah.gov/server/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0/query`, params, cb)
}

ArcGIS.Rivers = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahMajor_Streams/FeatureServer/0/query`, params, cb)
}

ArcGIS.Roads = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahRoads/FeatureServer/0/query`, params, cb)
}

ArcGIS.Springs = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/SpringsNHDHighRes/FeatureServer/0/query`, params, cb)
}

ArcGIS.Streams = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahStreamsNHD/FeatureServer/0/query`, params, cb)
}

ArcGIS.Trails = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/TrailsAndPathways/FeatureServer/0/query`, params, cb)
}



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

	return new Promise((resolve, reject) => {
		if (https != null && geojsonStream != null) {
			/* NodeJs */
			https.get(`${url}?${qs}`, res => {
				if (res.statusCode !== 200) {return reject(new Error('Request Failed.\n' + `Status Code: ${res.statusCode}`))}
				res.setEncoding('utf8')
				let data = '', count = 0
				if (cb != null) {
					res.pipe(geojsonStream.parse((feature, index) => {
						count = index
						cb(feature, index)
					}))
				} else {
					res.on('data', chunk => {data += chunk.toString()})
				}
				res.on('end', () => {
					if (cb != null) {
						if (count > 0 && count < params.resultRecordCount) {
							params.resultOffset += count
							ArcGIS.Query(url, params, cb).then(resolve).catch(reject)
						} else {
							resolve()
						}
					} else {
						let collection = JSON.parse(data)
						params.resultOffset += collection.features.length
						if (collection.features.length > 0 && params.resultOffset < params.resultRecordCount) {
							ArcGIS.Query(url, params, cb).then((_collection) => {
								_collection.features.forEach(feature => {collection.features.push(feature)})
								resolve(collection)
							}).catch(reject)
						} else {
							resolve(collection)
						}
					}
				})
			})
		} else {
			/* Browser */
			fetch(url).then(res => res.text()).then(res => {
				let collection = JSON.parse(res)
				if (cb != null) {
					collection.features.forEach(feature => {cb(feature)})
				}
				if (collection.Get('properties.exceededTransferLimit', false) === true) {
					params.resultOffset += params.resultRecordCount
					ArcGIS.Query(url, params, cb).then(_collection => {
						_collection.features.forEach(feature => {collection.features.push(feature)})
						resolve(collection)
					}).catch(reject)
				} else {
					resolve(collection)
				}
			}).catch(reject)
		}
	})
}



ArcGIS.Roads = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/UtahRoads/FeatureServer/0/query`, params, cb)
}

ArcGIS.LandOwnership = function () {
	let params = Extend({}, ArcGIS.DefaultParams, typeof arguments[0] === 'object' ? arguments[0] : {})
	let cb = arguments[0] instanceof Function ? arguments[0] : arguments[1] instanceof Function ? arguments[1] : null
	return ArcGIS.Query(`https://gis.trustlands.utah.gov/server/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0/query`, params, cb)
}


//OWNER, AGENCY, ADMIN, DESIG, STATE_LGD, UT_LGD, NATL_LGD, Edit_Date, Label_Federal, Label_State, GIS_Acres, COUNTY, Tribe

ArcGIS.LandOwnership = function (where = '1=1', bounds = null, size = 1000, start = 0, fields = '*', idsOnly = false, cb = null) {
	log('ArcGIS.LandOwnership('+size+'::'+start)
	return new Promise((resolve, reject) => {

		let url = `https://gis.trustlands.utah.gov/server/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0/query?where=${encodeURIComponent(where)}&outFields=${fields}&outSR=4326&f=geojson&resultOffset=${start}&resultRecordCount=${size}`

		if (bounds != null) {
			url += `&geometry=${encodeURIComponent(bounds.join(','))}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelEnvelopeIntersects`
		}
log(url)
		if (https != null && geojsonStream != null) {
			/* NodeJs */
			https.get(url, res => {
				if (res.statusCode !== 200) {return reject(new Error('Request Failed.\n' + `Status Code: ${res.statusCode}`))}
				res.setEncoding('utf8')
log('\t'+res.headers['content-length'])
				let data = ''
				if (cb != null) {
					res.pipe(geojsonStream.parse(cb))
				} else {
					res.on('data', chunk => {data += chunk.toString()})
				}
				res.on('end', () => {
					if (cb != null) {
						ArcGIS.LandOwnership(where, bounds, size, start+size, fields, idsOnly, cb).then(resolve).catch(reject)
					} else {
						let collection = JSON.parse(data)
						if (collection.features.length > 0) {
							ArcGIS.LandOwnership(where, bounds, size, start+size, fields, idsOnly, cb).then((_collection) => {
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
					ArcGIS.LandOwnership(where, bounds, size, start+size, fields, idsOnly, cb).then(_collection => {
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


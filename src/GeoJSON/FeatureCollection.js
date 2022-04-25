let zoomSizes = [1.4210854715202004e-14,85.0511287798066,66.51326044311185,40.979898069620155,19.03685253618199,9.02773583159518,4.382008936549958,2.157307093443052,1.0871452583600885,0.5414570853770542,0.27125841520654603,0.13549685878253115,0.06778153175958579,0.0338824921674572,0.016943314747734917,0.008472174510430364,0.004235957974749738,0.0021180113079424245,0.001059013734057146,0.00052950888704828,0.00026475494851752046]
function GetZoom(bounds) {
	for (var i = 0; i<zoomSizes.length; i++) {
		if ((bounds.lat.span/zoomSizes[i]) < 1.1 && bounds.lat.span/zoomSizes[i] > 0.9) {
			return i
		}
	}
	return -1
}

function FeatureCollection (collection) {
	if (typeof collection === 'undefined') {
		collection = {type: 'FeatureCollection', features: []}
	}

	Define(collection, 'classes', [])
	Define(collection, 'parent', null)

	Reflect.has(collection, 'features') && collection.Get('features', []).forEach(feature => {
		Feature(feature)
		feature.parent = collection
	})

	Define(collection, 'Bounds', {get: () => {
		return new Bounds(...Turf.bbox(collection))
	}})


	Define(collection, 'Add', (feature) => {
		Feature(feature)
		feature.parent = collection
		collection.features.push(feature)
		return collection
	})

	Define(collection, 'ApplyRules', (rules) => {
		rules.forEach(rule => {
			rule(collection)
		})
		collection.Get('features', []).forEach(feature => {
			rules.forEach(rule => {
				rule(feature)
			})
		})
	})

	Define(collection, 'ToSvg', (bounds, width = 1024, height = 1024, styles) => {
		if (bounds == null) {
			bounds = collection.Bounds
		}
		let svg = `<svg viewBox="0 0 ${width} ${height}" class="${collection.classes.join(' ')}" data-zoom="${GetZoom(bounds)}" data-bounds="${bounds.join(',')}" xmlns="http://www.w3.org/2000/svg">\n`
		collection.Get('features', []).forEach(feature => {
			svg += feature.ToSvg(width, height, bounds, styles)
		})
		svg += `</svg>\n`

		return svg
	})


	return collection
}


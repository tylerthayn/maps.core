function Feature (feature) {

	Define(feature, 'classes', [], true)
	Define(feature, 'parent', null)


	Define(feature, 'ToSvg', (width, height, bounds, styles) => {
		let svgHeader = '', svgFooter = ''
		if (typeof bounds === 'undefined') {
			svgHeader = `<svg width="${width}" height="${height}">\n`
			svgFooter = `</svg>`
			bounds = new Bounds(...Turf.bbox(feature))
		}

		let svg = '', pixels = null
		if (Turf.getType(feature) == 'Point') {
			pixels = Pixels(bounds, width, height, [Turf.getCoords(feature)])
			let radius = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 12, 13, 14, 15, 16, 17 ,18]

			svg =  `\t<g class="${feature.classes.join(' ')}" id="${feature.id}">\n`
			svg += `\t\t<circle cx="${pixels[0][0]}" cy="${pixels[0][1]}" r="10" />\n`
			svg += `\t</g>\n`
			return svgHeader + svg + svgFooter
		}

		if (Turf.getType(feature) == 'LineString') {
			pixels = Pixels(bounds, width, height, Turf.getCoords(feature))

			//let d = `M${pixels[0][0]} ${pixels[0][1]}`
			//pixels.slice(1).forEach(pixel => {d += ` L${pixel[0]} ${pixel[1]}`})

			//svg =  `\t<g class="${feature.classes.join(' ')}" id="${feature.id}">\n`
			//svg += `\t\t<path d="${d} z" />\n`
			//svg += `\t</g>\n`

			svg =  `\t<g class="${feature.classes.join(' ')}" id="${feature.id}">\n`
			svg += `\t\t<polyline points="${pixels.map(p => p.join(',')).join(' ')}" />\n`
			svg += `\t</g>\n`

			return svgHeader + svg + svgFooter
		}

		if (Turf.getType(feature) == 'Polygon') {
			svg =  `\t<g class="${feature.classes.join(' ')}" id="${feature.id}">\n`
			let coords = Turf.getCoords(feature)
			coords.forEach(row => {
				pixels = Pixels(bounds, width, height, row)
				let d = `M${pixels[0][0]} ${pixels[0][1]}`
				pixels.slice(1).forEach(pixel => {d += ` L${pixel[0]} ${pixel[1]}`})
				svg += `\t\t<path d="${d} z" />\n`
			})
			svg += `\t</g>\n`
			return svgHeader + svg + svgFooter
		}

	})


}

function Pixels (bounds, width, height, coords) {
	return bounds.Position(coords).map(c => {
		return [
			Math.round(c[0] * width),
			height - Math.round(c[1] * height)
		]
	})
}

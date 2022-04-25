(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js', 'https://cdn.jsdelivr.net/npm/@tyler.thayn/js.core@0.6.2/dist/core.js'], (Turf) => {
			return factory(Turf, null, null)
		})
	} else if (typeof module === 'object' && module.exports) {
		require('@tyler.thayn/js.core')
		module.exports = factory(require('@turf/turf'), require('https'), require('geojson-stream'))
	} else {
		fetch('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js').then(res=>res.text()).then(eval).finally(() => {
			fetch('https://cdn.jsdelivr.net/npm/@tyler.thayn/js.core@0.6.2/dist/core.js').then(res=>res.text()).then(eval).finally(() => {
				window.Maps = factory(turf, null, null)
			})
		})
	}
}(function (Turf, https, geojsonStream) {

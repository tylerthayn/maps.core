'use strict'
let Fs = require('fs')
let Path = require('path')
let Strip = require('strip-comments')
let UglifyJS = require("uglify-es")

let minifyOptions={compress:true,output:{quote_style:1}}
let requireMatch = /require\('(.+)'\)/g

let files = ['./src/GlobalMercator.js', './src/Range.js', './src/Point.js', './src/Coordinate.js', './src/CoordinateBounds.js', './src/PointBounds.js', './src/Bounds.js', './src/Tile.js', './src/GeoJSON/Feature.js', './src/GeoJSON/FeatureCollection.js', './src/ArcGIS.js', './src/index.js']

module.exports = function(grunt) {
	let pkg = require(Path.resolve('./package.json'))

	grunt.registerMultiTask('make', 'Make package distributable', function() {
		let options = this.options({})

		try {Fs.mkdirSync(Path.resolve('./dist'))} catch (e) {}
		let output = Fs.createWriteStream(Path.resolve('./dist', 'maps.js'), 'utf-8')
		let content = Fs.readFileSync(Path.resolve(__dirname, 'config', 'amd.header.js'), 'utf-8')+'\r\n'


		files.forEach(file => {
			content += Fs.readFileSync(Path.resolve(file), 'utf-8').replace(/^/mg, '\t') + '\r\n\r\n'
			/* Process Content: remove requires, ... */
			//output.write(content, console.log)
		})

		content += '\r\n\r\n' + Fs.readFileSync(Path.resolve(__dirname, 'config', 'amd.footer.js'), 'utf-8')+'\r\n'
		Fs.writeFileSync(Path.resolve('./dist', 'maps.js'), content, 'utf-8')
		//output.close()

		//Fs.writeFileSync(Path.resolve('./dist', 'maps.min.js'), UglifyJS.minify(Fs.readFileSync(Path.resolve('./dist', 'maps.js'), 'utf-8'), minifyOptions).code, 'utf-8')
		//grunt.log.ok()

	})

}

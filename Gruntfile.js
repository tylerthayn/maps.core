'use strict'

module.exports = function(grunt) {
	let pkg = require('./package.json')
	let make = {
		default: {
			options: {
			}
		}
	}

	grunt.initConfig({make: make, rev: {}})
	grunt.loadTasks('tasks')
}

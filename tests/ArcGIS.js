require('@tyler.thayn/js.core')
Maps = require('../')

let tile = new Maps.Tile(Maps.places.monroe, 12)

//Maps.ArcGIS.Roads({geometry: tile.bounds.join(',')}).then(logj).catch(logj)
Maps.ArcGIS.LandOwnership({geometry: tile.bounds.join(',')}).then(logj).catch(logj)



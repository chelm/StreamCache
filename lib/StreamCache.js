var fs = require('fs');

module.exports = function( options ){
  this.levels = options.levels || [0, 5];

  this.dir = options.dir + '/' + options.name;
  if ( !fs.existsSync( options.dir ) ) fs.mkdirSync( options.dir );
  if ( !fs.existsSync( this.dir ) ) fs.mkdirSync( this.dir );

  console.log(options);

  this.cache = function( json ){
    console.log( json );
    var c = json.geometry.coordinates;
    var z = this.levels[0];

    while ( z <= this.levels[ 1 ] ) {
      var tile = this.locationCoordinate( c[1], c[0], z);
      console.log(tile.x, tile.y, tile.z);
      this.save(json, tile);
      z++;
    }

  }

  this.locationCoordinate = function(lat, lon, zoom){
    var lon_rad = lon * (Math.PI / 180),
      lat_rad = lat * (Math.PI / 180),
      n = Math.pow(2.0, zoom);

    var tileX = Math.floor( ( ( lon + 180 ) / 360 ) * n );
    var tileY = Math.floor( ( 1 - ( Math.log( Math.tan( lat_rad ) + 1.0 / Math.cos( lat_rad ) ) / Math.PI ) ) * n / 2.0 );

    return { x : tileX, y: tileY, z: zoom };
  }

  this.save = function( json, tile ){
    if ( !fs.existsSync( this.dir + '/' + tile.z ) ) fs.mkdirSync( this.dir + '/' + tile.z ); 
    if ( !fs.existsSync( this.dir + '/' + tile.z + '/' + tile.x ) ) fs.mkdirSync( this.dir + '/' + tile.z + '/' + tile.x ); 
    if ( !fs.existsSync( this.dir + '/' + tile.z + '/' + tile.x + '/' + tile.y + '.json') ) { 
      // write new file
      var skel = {type:'FeatureCollection', features: [ json ] }; 
      fs.writeFileSync( this.dir + '/' + tile.z + '/' + tile.x + '/' + tile.y + '.json', JSON.stringify( skel ) ); 
    } else {
      // read
      fs.readFile( this.dir + '/' + tile.z + '/' + tile.x + '/' + tile.y + '.json', 'utf8', function (err, data ) {
        if (err) {
          return console.log(err);
        }

        var geojson = JSON.parse( data );
        geojson.features.push( json );
        fs.writeFileSync( this.dir + '/' + tile.z + '/' + tile.x + '/' + tile.y + '.json', JSON.stringify( geojson ) );
      });
      // append
      // save 
    } 
  }
  
  return this;
}

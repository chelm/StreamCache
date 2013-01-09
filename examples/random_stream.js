
function randomNumber( min, max ) { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var options = { 
  dir: './tiles', 
  name: 'ex_' + randomNumber( 0, 5000 ), 
  levels: [3, 7] 
};

var StreamCache = new require( '../lib' )( options );
var npoints = count = 100;

var stream = setInterval(function(){
  var lat = randomNumber(-60, 60);
  var lon = randomNumber(-150, 150);

  var pnt = { properties: { id: count - npoints }, geometry: { coordinates: [ lon, lat ], type: 'Point' } };

  // cache the point in to
  StreamCache.cache( pnt );

  if (!npoints--) clearInterval(stream);

},200);




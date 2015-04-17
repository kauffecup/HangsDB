var connection = require('./connection');
var arrangement = require('./arrangement');
  // Just me testing things out.
dbconnection = connection.createConnection();
connection.openConnection(dbconnection);

//var arr = {original_song_year:6};
arrangement.getPage(dbconnection, 1, function(err, val)
{
	console.log(val);
});

//arrangement.insertForAllFields(dbconnection, "junction_test","dummy artist",1901,"Fall 1902",10,1,"dummy genre",1,"","","","","",5,"","",1,"dummy notes",5,"f/dum",true,4,"","","","","", function(){
//	console.log("Here");
//});

connection.closeConnection(dbconnection);

// arranged_semester_id
// blown_pitch_id (s)
// song_key_id (s)
// artist_id (s)
// arrangement_type_id (s)
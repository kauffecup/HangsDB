var connection = require('./connection');
var arrangement = require('./arrangement');
  // Just me testing things out.
dbconnection = connection.createConnection();
connection.openConnection(dbconnection);

arrangement.getForId(dbconnection, 1, function(err, val)
{
	console.log(val);
});

connection.closeConnection(dbconnection);

//addAllToArrangement(connection, "dummy's name","dummy artist",1901,"Fall 1902",10,1,"dummy genre",1,"","","","","","","","",1,"dummy notes",1,"f/dum",true,4,["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"], function(){
//	console.log("Here");
//});


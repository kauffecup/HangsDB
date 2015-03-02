var mysql = require('mysql');

var arrangementFields = [
    "id",
    "name",
    "original_song_year",
    "quality",
    "genre",
    "nickname",
    "pdf_url",
    "finale_url",
    "youtube_url",
    "arranged_semester_id"
];

/**
 * Returns a connection object, pass it to the other functions
 * to open/close/get stuff from the db
 */
function createConnection()
{
	connection = mysql.createConnection({
        	host : 'localhost',
        	user : 'root',
        	password : '',
        	database : 'Sage'
	});
	return connection;
}

/**
 * Opens a connection, allowing you to use it in querying the database
 */
function openConnection(connection)
{
	connection.connect(function(err){
		if(err)
		{
			console.err("Error connecting: " + err.stack);
			return
		}
		else
		{
			console.log("Connected as id "+connection.threadId);
		}
	});
}

/**
 * Closes a connection. Call when you're done querying.
 */
function closeConnection(connection)
{
	connection.end();
	console.log("Connection closed");
}

/*
 * Queries the database, returning all arrangements where "field" matches "value"
 * and passing them to callback(error, rows).
 *
 * @param connection	- a mysql connection object, must be open.
 * @param field			- the field to find matches in.
 * @param value			- the value to match.
 * @param callback		- a callback function(err, rows)
 *		@param err 	- any error thrown during the mysql fetch
 * 		@param rows - an array of row objects of the format fieldname:value
 */
function getArrangements(connection, field, value, callback)
{
	sql = "SELECT * FROM arrangement WHERE "+field+" = '"+value+"'";
	connection.query(sql, callback);
}

/*
 * Queries the database, returning all arrangements where "field" contains "search"
 * and passing them to callback(error, rows).
 *
 * @param connection	- a mysql connection object, must be open.
 * @param field			- the field to search the database over.
 * @param search		- the value to search for.
 * @param callback		- a callback function(err, rows)
 *		@param err 	- any error thrown during the mysql fetch
 * 		@param rows - an array of row objects of the format fieldname:value
 */
function searchArrangements(connection, field, value, callback)
{
	sql = "SELECT * FROM arrangement WHERE "+field+" LIKE '%"+value+"%'";
	connection.query(sql, callback);
}

// TODO: Function that searches both name and nickname, specifically for song lookups by names

// TODO: Finish this. This is what lets you iterate over database entries without loading all at once.
function getArrangementIterator(connection)
{
	//return
}


// Just me testing things out.
// connection = createConnection();
// openConnection(connection);
// searchArrangements(connection, function(err, cols)
// 	{
// 		// console.log(cols);
// 		var keys = [];
// 		for(var k in cols)
// 		{
// 			console.log(cols[k]);
// 		}
// 	});
// closeConnection(connection);

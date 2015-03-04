var mysql = require('mysql');
var pageSize = 50;

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
 * Queries the database, returning pageSize arrangements from the given pageNum
 * and passing them to callback(error, rows).
 *
 * @param connection	- a mysql connection object, must be open.
 * @param callback		- a callback function(err, rows)
 *		@param err 	- any error thrown during the mysql fetch
 * 		@param rows - an array of row objects of the format fieldname:value
 * @param pageNum		- int, which set of pageSize arrangements you want.
 *
 * NOTE: Page numbers are currently one-indexed. Jon, if you want them to be zero-indexed let me know.
 */
function getArrangementPage(connection, callback, pageNum)
{
	// It's null or zero or something
	if(!pageNum)
	{
		pageNum = 1;
	}
	// The number of entries to skip before the first one we return
	offset = pageSize*(pageNum-1)
	sql = "SELECT * FROM arrangement LIMIT "+pageSize+" OFFSET "+offset+"";
	connection.query(sql, callback);
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
function matchArrangements(connection, field, value, callback)
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

function multiMatchArrangements(connection, fieldArray, valueArray, callback)
{
	if(fieldArray.length !== valueArray.length)
	{
		throw "array lengths must match"
	}
	if(fieldArray.length < 1)
	{
		throw "arrays must not be empty";
	}

	sql = "SELECT * FROM arrangement WHERE ";
	for(i=0; i<fieldArray.length; i++)
	{
		if (valueArray[i] === "NULL")
		{
			sql = sql + fieldArray[i] + " IS NULL";
		}
		else
		{
			sql = sql + fieldArray[i] + " = '"+valueArray[i]+"'";
		}

		if(i != fieldArray.length-1)
		{
			sql = sql + " AND ";
		}
	}
	connection.query(sql, callback);
}

// TODO: Function that searches both name and nickname, specifically for song lookups by names

// Just me testing things out.
connection = createConnection();
var fields = new Array("id", "pdf_url");
var values = new Array(1, "NULL");
openConnection(connection);
multiMatchArrangements(connection, fields, values, function(err, rows)
	{
		for(i=0; i<rows.length; i++)
		{
			console.log(rows[i]);
		}
	}, 1);
closeConnection(connection);

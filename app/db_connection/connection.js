// var mysql = require('mysql');
// var connection = mysql.createConnection({
//         host : 'localhost',
//         user : 'root',
//         password : '',
//         database : 'Sage'
// });

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
 *
 */
function openConnection(connection)
{
	connection.connect(function(err){
		if(err)
		{
			console.err("error connecting: " + err.stack);
			return
		}
		else
		{
			console.log("Connected as id "+connection.threadId);
		}
	});
}

/*
 * Closes a connection. Call when you're done querying.
 */

function closeConnection(connection)
{
	connection.end();
}

/*
 * Queries the database, returning all arrangements where "field" matches "value"
 * and passing them to callback(error, rows).
 */

function getArrangement(connection, field, value, callback)
{
	//connection.connect();
	sql = "SELECT * FROM arrangement WHERE "+field+" = \'"+value+"\'";
	connection.query(sql, callback(err, rows));
	//connection.end()
}

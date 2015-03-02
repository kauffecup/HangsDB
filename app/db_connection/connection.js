var mysql = require('mysql');

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
			console.err("Error connecting: " + err.stack);
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
	console.log("Connection closed");
}

/*
 * Queries the database, returning all arrangements where "field" matches "value"
 * and passing them to callback(error, rows).
 *
 * @param connection	- a mysql connection object, must be open.
 * @param field			- the field to search the database over.
 * @param value			- the value to search for.
 * @param callback		- a callback function(err, rows)
 *		@param err 	- any error thrown during the mysql fetch
 * 		@param rows - an array of row objects of the format fieldname:value
 */
function getArrangement(connection, field, value, callback)
{
	//connection.connect();
	sql = "SELECT * FROM arrangement WHERE "+field+" = \'"+value+"\'";
	connection.query(sql, callback);
	//connection.end()
}

// Just me testing things out.
// connection = createConnection();
// openConnection(connection);
// getArrangement(connection, "", 1, function(err, rows)
// 	{
// 		for(i = 0; i < rows.length; i++)
// 		{
// 			row = rows[i];
// 			console.log(row);
// 		}
// 	});
// closeConnection(connection);

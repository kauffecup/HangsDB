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

module.exports = {
  /**
   * Returns a connection object, pass it to the other functions
   * to open/close/get stuff from the db
   */
  createConnection: function ()
  {
    connection = mysql.createConnection({
            host : 'localhost',
            user : 'root',
            password : '',
            database : 'Sage'
    });
    return connection;
  },

  /**
   * Opens a connection, allowing you to use it in querying the database
   */
  openConnection: function (connection)
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
  },

  /**
   * Closes a connection. Call when you're done querying.
   */
  closeConnection: function (connection)
  {
    connection.end();
    console.log("Connection closed");
  },

  /*
   * Queries the database, returning pageSize arrangements from the given pageNum
   * and passing them to callback(error, rows).
   *
   * @param connection  - a mysql connection object, must be open.
   * @param callback    - a callback function(err, rows)
   *    @param err  - any error thrown during the mysql fetch
   *    @param rows - an array of row objects of the format fieldname:value
   * @param pageNum   - int, which set of pageSize arrangements you want.
   *
   * NOTE: Page numbers are currently one-indexed. Jon, if you want them to be zero-indexed let me know.
   */
  getArrangementPage: function (connection, callback, pageNum)
  {
    // It's null or zero or something
    pageNum = pageNum || 1;
    
    // The number of entries to skip before the first one we return
    offset = pageSize*(pageNum-1)
    sql = "SELECT * FROM arrangement LIMIT "+pageSize+" OFFSET "+offset+"";
    connection.query(sql, callback);
  },

  /*
   * Queries the database, returning all arrangements where "field" matches "value"
   * and passing them to callback(error, rows).
   *
   * @param connection  - a mysql connection object, must be open.
   * @param field     - the field to find matches in.
   * @param value     - the value to match.
   * @param callback    - a callback function(err, rows)
   *    @param err  - any error thrown during the mysql fetch
   *    @param rows - an array of row objects of the format fieldname:value
   */
  matchArrangements: function (connection, field, value, callback)
  {
    sql = "SELECT * FROM arrangement WHERE "+field+" = '"+value+"'";
    connection.query(sql, callback);
  },

  /*
   * Queries the database, returning all arrangements where "field" contains "search"
   * and passing them to callback(error, rows).
   *
   * @param connection  - a mysql connection object, must be open.
   * @param field     - the field to search the database over.
   * @param search    - the value to search for.
   * @param callback    - a callback function(err, rows)
   *    @param err  - any error thrown during the mysql fetch
   *    @param rows - an array of row objects of the format fieldname:value
   */
  searchArrangements: function (connection, field, value, callback)
  {
    sql = "SELECT * FROM arrangement WHERE "+field+" LIKE '%"+value+"%'";
    connection.query(sql, callback);
  },

  multiMatchArrangements: function (connection, fieldArray, valueArray, callback)
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
};

function getArrangersForId(connection, id, callback)
{
	sql = "SELECT * FROM arrangement_arranger WHERE arrangement_id = "+id;
	connection.query(sql, callback);
}

function getArtistsForId(connecion, id, callback)
{
	sql = "SELECT * FROM arrangement_artist WHERE arrangement_id = "+id;
	connection.query(sql, callback);
}

function getConcertsForId(connecion, id, callback)
{
	sql = "SELECT * FROM arrangement_concert WHERE arrangement_id = "+id;
	connection.query(sql, callback);
}

function getSoloistsForId(connecion, id, callback)
{
	sql = "SELECT * FROM arrangement_soloist WHERE arrangement_id = "+id;
	connection.query(sql, callback);
}

function getNameForId(connecion, id, callback)
{
	sql = "SELECT name FROM arrangement WHERE id = "+id;
	connection.query(sql, callback);
}
// TODO: Function that searches both name and nickname, specifically for song lookups by names


// Just me testing things out.
// connection = createConnection();
// var fields = new Array("id", "pdf_url");
// var values = new Array(1, "NULL");
// openConnection(connection);
// getNameFromId(connection, 1, function(err, rows)
// 	{
// 		for(i=0; i<rows.length; i++)
// 		{
// 			console.log(rows[i]['name']);
// 		}
// 	});
// closeConnection(connection);

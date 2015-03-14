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
   * Opens a new connection automatically if this one fails.
   * Should be called on all new connections to prevent timeout issues.
   */
  reopenConnectionOnDisconnect: function (connection)
  {
  	connection.on("error", function(err)
  	{
  		if(!err.fatal)
  		{
  			return;
  		}
  		if(err.code !== "PROTOCOL_CONNECTION_LOST")
  		{
  			throw err;
  		}

  		connection = this.createConnection();
  		connection.connect(function(error)
  			{
  				if(error)
  				{
  					// This probably means the DB exploded.
  					throw "CANNOT_REOPEN_CONNECTION"
  				}
  				else
  				{
  					this.replaceClientOnDisconnect(connection);
  				}
  			});
  	});
  },

  addAllToArrangement: function (connection, name, artist_name, original_song_year, arranged_semester_name, quality, reception, genre, arrangement_type_id, nickname, has_syllables, pdf_url, finale_url, youtube_url, blown_pitch_id, difficulty, has_choreo, solo_voice_part_id, notes, song_key, recording_url, active, number_of_parts, arranger_array, semester_array, soloist_array, director_array, concert_array, callback)
  {
  	// get ready for the mysql query of your life.
  	// solo_voice_part_id and arrangement_type_id are going to be straight IDs.
  	sql = "INSERT IGNORE INTO artist SET name = "+artist_name;
    connection.query(sql, function() {
    	if(err)
    	{
    		console.err("Error inserting artist: "+err.stack);
    	}
    });

    sql = "INSERT IGNORE INTO semester SET name = "+arranged_semester_name;
    connection.query(sql, function() {
    	if(err)
    	{
    		console.err("Error inserting semester: "+err.stack);
    	}
    });

   //  sql = "INSERT INTO arrangement"

  	// for(i=0; i<arranger_array.length; i++)
  	// {
  	// 	arranger = arranger_array[i];
  	// }
  	// for(i=0; i<semester_array.length; i++)
  	// {
  	// 	semester = semester_array[i];
  	// }
  	// for(i=0; i<soloist_array.length; i++)
  	// {
  	// 	soloist = soloist_array[i];
  	// }
  	// for(i=0; i<director_array.length; i++)
  	// {
  	// 	director = director_array[i];
  	// }
  	// for(i=0; i<concert_array.length; i++)
  	// {
  	// 	concert = concert_array[i];
  	// }
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

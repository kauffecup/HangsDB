var mysql = require('mysql');
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

};

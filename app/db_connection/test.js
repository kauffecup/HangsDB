var mysql = require('mysql');
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

function openConnection(connection)
{
    connection.connect(function(err){
      if(err)
      {
        console.log("Error connecting: " + err.stack);
        return
      }
      else
      {
        console.log("Connected as id "+connection.threadId);
      }
    });
}

function closeConnection(connection)
{
    connection.end();
    console.log("Connection closed");
}

  // Just me testing things out.
connection = createConnection();
// var fields = new Array("id", "pdf_url");
// var values = new Array(1, "NULL");
openConnection(connection);
// getNameFromId(connection, 1, function(err, rows)
// 	{
// 		for(i=0; i<rows.length; i++)
// 		{
// 			console.log(rows[i]['name']);
// 		}
// 	});
closeConnection(connection);
setTimeout(function(){
    openConnection(connection);
},5000);


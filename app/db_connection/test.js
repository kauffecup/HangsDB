var mysql = require('mysql');
var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'Sage'
});

function query(queryString)
{
        connection.connect();
        var rows = connection.query(queryString);
        connection.end();
	return rows;
}

console.log(query("SELECT * FROM arrangement"));

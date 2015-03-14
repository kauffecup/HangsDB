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


function addAllToArrangement (name, artist_name, original_song_year, arranged_semester_name, quality, reception, genre, arrangement_type_id, nickname, has_syllables, pdf_url, finale_url, youtube_url, blown_pitch_id, difficulty, has_choreo, solo_voice_part_id, notes, song_key, recording_url, active, number_of_parts, arranger_array, semester_array, soloist_array, director_array, concert_array)
{
  	// get ready for the mysql query of your life.
  	// solo_voice_part_id and arrangement_type_id are going to be straight IDs.
  	sql = "INSERT IGNORE INTO artist SET name = "+artist_name;
    connection.query(sql, function {
    	if(err)
    	{
    		console.err("Error inserting artist: "+err.stack);
    	}
    });

    sql = "INSERT IGNORE INTO semester SET name = "+arranged_semester_name;
    connection.query(sql, function {
    	if(err)
    	{
    		console.err("Error inserting semester: "+err.stack);
    	}
    });

    sql = "INSERT INTO arrangement SET name = name"
    connection.query(sql, function {
    	if(err)
    	{
    		console.err("Error inserting arrangement: "+err.stack);
    	}
    });

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
}


  // Just me testing things out.
connection = createConnection();
openConnection(connection);
addAllToArrangement("dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy","dummy");
closeConnection(connection);


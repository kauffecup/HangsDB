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


function addAllToArrangement (connection, name, artist_name, original_song_year, arranged_semester_name, quality, reception, genre, arrangement_type_id, nickname, has_syllables, pdf_url, finale_url, youtube_url, blown_pitch_id, difficulty, has_choreo, solo_voice_part_id, notes, song_key_id, recording_url, active, number_of_parts, arranger_array, semester_array, soloist_array, director_array, concert_array, callback)
{
  	// get ready for the mysql query of your life.
  	// solo_voice_part_id and arrangement_type_id are going to be straight IDs.
  	sql = "INSERT IGNORE INTO artist SET name = '"+artist_name+"'";
    connection.query(sql, function(err, result) {
    	if(err)
    	{
    		console.log("Error or duplicate inserting artist: "+err.stack);
    	}
    	else 
    	{
    		console.log("Inserted artist");
    	}
    });

    sql = "INSERT IGNORE INTO semester SET name = '"+arranged_semester_name+"'";
    connection.query(sql, function(err, result) {
    	if(err)
    	{
    		console.log("Error or duplicate inserting semester: "+err.stack);
    	}
    	else 
    	{
    		console.log("Inserted semester");
    	}
    });

    sql = "INSERT INTO arrangement (name, original_song_year, quality, genre, nickname, pdf_url, finale_url, youtube_url, arranged_semester_id, reception, notes, difficulty, recording_url, song_key, pitch_blown, number_of_parts, solo_voice_part_id, has_choreo, active, has_syllables, artist_id, arrangement_type_id) VALUES(";
    sql += "'"+name+"', ";
    sql += original_song_year+", ";
    sql += quality+", ";
    sql += "'"+genre+"', ";
    sql += "'"+nickname+"', ";
    sql += "'"+pdf_url+"', ";
    sql += "'"+finale_url+"', ";
    sql += "'"+youtube_url+"', ";
    sql += "(SELECT id FROM semester WHERE name = '"+arranged_semester_name+"'), ";
    sql += reception+", "
    sql += "'"+notes+"', ";
    sql += difficulty+", ";
    sql += "'"+recording_url+"', ";
    sql += song_key_id+", ";
    sql += blown_pitch_id+", ";
    sql += number_of_parts+", ";
    sql += solo_voice_part_id+", ";
    sql += has_choreo+", ";
    sql += active+", ";
    sql += has_syllables+", ";
 	sql += "(SELECT id FROM artist WHERE name = '"+artist_name+"'), ";
 	sql += arrangement_type_id+")";
	console.log(sql);
	connection.query(sql, function(err, result) {
		if(err)
		{
			console.log("Error inserting arrangement ");
		}
		else
		{
			console.log("Inserted arrangement");
			var newArrangementId = result.insertId;
			for(i=0; i<arranger_array.length; i++)
			{
				arranger_name = arranger_array[i];

			    sql = "INSERT IGNORE INTO hangover SET name = '"+arranger_name+"'";
				connection.query(sql, function(err, result) {
			    	if(err)
			    	{
			    		console.log("Error or duplicate inserting arranger: "+err.stack);
			    	}
			    	else 
			    	{
			    		console.log("Inserted arranger");
			    	}
		    	});

				sql = "INSERT IGNORE INTO arrangement_arranger (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+arranger_name+"')";
    			connection.query(sql, function(err, result) {
		    		if(err)
		    		{
		    			console.log("Error or duplicate inserting arranger junction: "+err.stack);
		    		}
		    		else 
		    		{
		    			console.log("Inserted arranger junction");
		    		}
    			});
			}
			for(i=0; i<semester_array.length; i++)
			{
				semester_name = semester_array[i];

			    sql = "INSERT IGNORE INTO semester SET name = '"+semester_name+"'";
				connection.query(sql, function(err, result) {
			    	if(err)
			    	{
			    		console.log("Error or duplicate inserting semester: "+err.stack);
			    	}
			    	else 
			    	{
			    		console.log("Inserted semester");
			    	}
		    	});

				sql = "INSERT IGNORE INTO arrangement_semester (arrangement_id, semester_id) VALUES("+newArrangementId+", (SELECT id FROM semester WHERE name = '"+semester_name+"'))";
    			connection.query(sql, function(err, result) {
		    		if(err)
		    		{
		    			console.log("Error or duplicate inserting semester junction: "+err.stack);
		    		}
		    		else 
		    		{
		    			console.log("Inserted semester junction");
		    		}
    			});
			}
			for(i=0; i<soloist_array.length; i++)
			{
				soloist_name = soloist_array[i];

				sql = "INSERT IGNORE INTO hangover SET name = '"+soloist_name+"'";
				connection.query(sql, function(err, result) {
			    	if(err)
			    	{
			    		console.log("Error or duplicate inserting soloist: "+err.stack);
			    	}
			    	else 
			    	{
			    		console.log("Inserted soloist");
			    	}
		    	});

				sql = "INSERT IGNORE INTO arrangement_soloist (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+soloist_name+"'))";
    			connection.query(sql, function(err, result) {
		    		if(err)
		    		{
		    			console.log("Error or duplicate inserting soloist junction: "+err.stack);
		    		}
		    		else 
		    		{
		    			console.log("Inserted soloist junction");
		    		}
    			});

			}
			for(i=0; i<director_array.length; i++)
			{
				director_name = director_array[i];

				sql = "INSERT IGNORE INTO hangover SET name = '"+director_name+"'";
				connection.query(sql, function(err, result) {
			    	if(err)
			    	{
			    		console.log("Error or duplicate inserting director: "+err.stack);
			    	}
			    	else 
			    	{
			    		console.log("Inserted director");
			    	}
		    	});

				sql = "INSERT IGNORE INTO arrangement_director (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+director_name+"'))";
    			connection.query(sql, function(err, result) {
		    		if(err)
		    		{
		    			console.log("Error or duplicate inserting director junction: "+err.stack);
		    		}
		    		else 
		    		{
		    			console.log("Inserted director junction");
		    		}
    			});
			}
			for(i=0; i<concert_array.length; i++)
			{
				concert_name = concert_array[i];

				sql = "INSERT IGNORE INTO concert SET name = '"+concert_name+"'";
				connection.query(sql, function(err, result) {
			    	if(err)
			    	{
			    		console.log("Error or duplicate inserting concert: "+err.stack);
			    	}
			    	else 
			    	{
			    		console.log("Inserted concert");
			    	}
		    	});

				sql = "INSERT IGNORE INTO arrangement_concert (arrangement_id, concert_id) VALUES("+newArrangementId+", (SELECT id FROM concert WHERE name = '"+concert_name+"'))";
    			connection.query(sql, function(err, result) {
		    		if(err)
		    		{
		    			console.log("Error or duplicate inserting concert junction: "+err.stack);
		    		}
		    		else 
		    		{
		    			console.log("Inserted concert junction");
		    		}
    			});
			}
		}
		callback(err, result);
	});
}


  // Just me testing things out.
connection = createConnection();
openConnection(connection);
addAllToArrangement(connection, "dummy name","dummier artist",1901,"Fall 1902",10,1,"dummy genre",1,"DUM",true,"c/dum","d/dum","e/dum",1,10,1,1,"dummy notes",1,"f/dum",1,4,["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"], function(){
	console.log("Here");
});


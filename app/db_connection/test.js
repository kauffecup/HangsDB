// var mysql = require('mysql');
// function createConnection()
// {
//     connection = mysql.createConnection({
//             host : '104.131.180.221',
//             user : 'root',
//             password : '',
//             database : 'Sage'
//     });
//     return connection;
// }

// function openConnection(connection)
// {
//     connection.connect(function(err){
//       if(err)
//       {
//         console.log("Error connecting: " + err.stack);
//         return
//       }
//       else
//       {
//         console.log("Connected as id "+connection.threadId);
//       }
//     });
// }

// function closeConnection(connection)
// {
//     connection.end();
//     console.log("Connection closed");
// }


// function addAllToArrangement (connection, name, artist_name, original_song_year, arranged_semester_name, quality, reception, genre, arrangement_type_id, nickname, has_syllables, pdf_url, finale_url, youtube_url, blown_pitch_id, difficulty, has_choreo, solo_voice_part_id, notes, song_key_id, recording_url, active, number_of_parts, arranger_array, semester_array, soloist_array, director_array, concert_array, callback)
// {
//   	// get ready for the mysql query of your life.
//   	// solo_voice_part_id and arrangement_type_id are going to be straight IDs.
//   	if(artist_name)
//   	{
// 	  	sql = "INSERT IGNORE INTO artist SET name = '"+artist_name+"'";
// 	    connection.query(sql, function(err, result) {
// 	    	if(err)
// 	    	{
// 	    		console.log("Error or duplicate inserting artist: "+err.stack);
// 	    	}
// 	    	else 
// 	    	{
// 	    		console.log("Inserted artist");
// 	    	}
// 	    });
//     }
//     if(arranged_semester_name)
//     {
// 	    sql = "INSERT IGNORE INTO semester SET name = '"+arranged_semester_name+"'";
// 	    connection.query(sql, function(err, result) {
// 	    	if(err)
// 	    	{
// 	    		console.log("Error or duplicate inserting semester: "+err.stack);
// 	    	}
// 	    	else 
// 	    	{
// 	    		console.log("Inserted semester");
// 	    	}
// 	    });
// 	}

//     sql = "INSERT INTO arrangement (name, original_song_year, quality, genre, nickname, pdf_url, finale_url, youtube_url, arranged_semester_id, reception, notes, difficulty, recording_url, song_key, pitch_blown, number_of_parts, solo_voice_part_id, has_choreo, active, has_syllables, artist_id, arrangement_type_id) VALUES(";
//     if(!name)
//     {
//     	name = null;
//     }
//     sql += connection.escape(name)+", ";
//     if(typeof original_song_year !== 'number')
//     {
//     	original_song_year = null;
//     }
//     sql += connection.escape(original_song_year)+", ";
//     if(typeof quality !== 'number')
//     {
//     	quality = null;
//     }
//    	sql += connection.escape(quality)+", ";
// 	if(!genre)
// 	{
// 		genre = null;
// 	}
// 	sql += connection.escape(genre)+", ";
// 	if(!nickname)
// 	{
// 	    nickname = null;
// 	}
// 	sql += connection.escape(nickname)+", ";
// 	if(!pdf_url)
// 	{	
// 	    pdf_url = null;
// 	}
// 	sql += connection.escape(pdf_url)+", ";
// 	if(!finale_url)
// 	{
// 		finale_url = null;
//     }
//     sql += connection.escape(finale_url)+", ";
//     if(!youtube_url)
//    	{
//     	youtube_url = null;
//     }
//     sql += connection.escape(youtube_url)+", ";
//     if(arranged_semester_name)
//     {
//     	sql += "(SELECT id FROM semester WHERE name = "+connection.escape(arranged_semester_name)+"), ";
//     }
//     else
//     {
//     	sql += connection.escape(null)+", ";
//     }
//     if(typeof reception !== 'number')
//     {
//     	reception = null;
//     }
//     sql += connection.escape(reception)+", ";
//     if(!notes)
//     {
//     	notes = null;
// 	}
// 	sql += connection.escape(notes)+", ";
// 	if(typeof difficulty !== 'number')
//     {
//     	difficulty = null;
//     }
//     sql += connection.escape(difficulty)+", ";
//     if(!recording_url)
//     {
//     	recording_url = null;
//     }
//     sql += connection.escape(recording_url)+", ";
//     if(typeof song_key_id !== 'number')
//     {
//     	song_key_id = null;
//     }
//     sql += connection.escape(song_key_id)+", ";
//     if(typeof blown_pitch_id !== 'number')
//     {
//     	blown_pitch_id = null;
//     }
//     sql += connection.escape(blown_pitch_id)+", ";
//     if(typeof number_of_parts !== 'number')
//     {
//     	number_of_parts = null;
//     }
//     sql += number_of_parts+", ";
//     if(typeof solo_voice_part_id !== 'number')
//     {
//     	solo_voice_part_id = null;
//     }
//     sql += connection.escape(solo_voice_part_id)+", ";
//     if(typeof has_choreo !== 'boolean')
//     {
//     	has_choreo = null;
//     }
//     sql += connection.escape(has_choreo)+", ";
//     if(typeof active !== 'boolean')
//     {
//     	active = null;
//     }
//     sql += connection.escape(active)+", ";
//     if(typeof has_syllables !== 'boolean')
//     {
//     	has_syllables = null;
//     }
//     sql += connection.escape(has_syllables)+", ";
//     if(artist_name)
//     {
//  		sql += "(SELECT id FROM artist WHERE name = '"+artist_name+"'), ";
//  	}
//  	else
//  	{
//     	sql += connection.escape(null)+", ";
//  	}
//  	if(typeof arrangement_type_id !== 'number')
//     {
//     	arrangement_type_id = null;
//     }
//  	sql += connection.escape(arrangement_type_id)+")";

//     console.log(sql);
// 	connection.query(sql, function(err, result) {
// 		if(err)
// 		{
// 			console.log("Error inserting arrangement: "+err.stack);
// 		}
// 		else
// 		{
// 			console.log("Inserted arrangement");
// 			var newArrangementId = result.insertId;
// 			if(arranger_array)
// 			{
// 				for(i=0; i<arranger_array.length; i++)
// 				{
// 					arranger_name = arranger_array[i];

// 				    sql = "INSERT IGNORE INTO hangover SET name = '"+arranger_name+"'";
// 					connection.query(sql, function(err, result) {
// 				    	if(err)
// 				    	{
// 				    		console.log("Error or duplicate inserting arranger: "+err.stack);
// 				    	}
// 				    	else 
// 				    	{
// 				    		console.log("Inserted arranger");
// 				    	}
// 			    	});

// 					sql = "INSERT IGNORE INTO arrangement_arranger (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+arranger_name+"'))";
// 					console.log(sql);
// 	    			connection.query(sql, function(err, result) {
// 			    		if(err)
// 			    		{
// 			    			console.log("Error or duplicate inserting arranger junction: "+err.stack);
// 			    		}
// 			    		else 
// 			    		{
// 			    			console.log("Inserted arranger junction");
// 			    		}
// 	    			});
// 				}
// 			}
// 			if(semester_array)
// 			{
// 				for(i=0; i<semester_array.length; i++)
// 				{
// 					semester_name = semester_array[i];

// 				    sql = "INSERT IGNORE INTO semester SET name = '"+semester_name+"'";
// 					connection.query(sql, function(err, result) {
// 				    	if(err)
// 				    	{
// 				    		console.log("Error or duplicate inserting semester: "+err.stack);
// 				    	}
// 				    	else 
// 				    	{
// 				    		console.log("Inserted semester");
// 				    	}
// 			    	});

// 					sql = "INSERT IGNORE INTO arrangement_semester (arrangement_id, semester_id) VALUES("+newArrangementId+", (SELECT id FROM semester WHERE name = '"+semester_name+"'))";
// 	    			connection.query(sql, function(err, result) {
// 			    		if(err)
// 			    		{
// 			    			console.log("Error or duplicate inserting semester junction: "+err.stack);
// 			    		}
// 			    		else 
// 			    		{
// 			    			console.log("Inserted semester junction");
// 			    		}
// 	    			});
// 				}
// 			}
// 			if(soloist_array)
// 			{
// 				for(i=0; i<soloist_array.length; i++)
// 				{
// 					soloist_name = soloist_array[i];

// 					sql = "INSERT IGNORE INTO hangover SET name = '"+soloist_name+"'";
// 					connection.query(sql, function(err, result) {
// 				    	if(err)
// 				    	{
// 				    		console.log("Error or duplicate inserting soloist: "+err.stack);
// 				    	}
// 				    	else 
// 				    	{
// 				    		console.log("Inserted soloist");
// 				    	}
// 			    	});

// 					sql = "INSERT IGNORE INTO arrangement_soloist (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+soloist_name+"'))";
// 	    			connection.query(sql, function(err, result) {
// 			    		if(err)
// 			    		{
// 			    			console.log("Error or duplicate inserting soloist junction: "+err.stack);
// 			    		}
// 			    		else 
// 			    		{
// 			    			console.log("Inserted soloist junction");
// 			    		}
// 	    			});

// 				}
// 			}
// 			if(director_array)
// 			{
// 				for(i=0; i<director_array.length; i++)
// 				{
// 					director_name = director_array[i];

// 					sql = "INSERT IGNORE INTO hangover SET name = '"+director_name+"'";
// 					connection.query(sql, function(err, result) {
// 				    	if(err)
// 				    	{
// 				    		console.log("Error or duplicate inserting director: "+err.stack);
// 				    	}
// 				    	else 
// 				    	{
// 				    		console.log("Inserted director");
// 				    	}
// 			    	});

// 					sql = "INSERT IGNORE INTO arrangement_director (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+director_name+"'))";
// 	    			connection.query(sql, function(err, result) {
// 			    		if(err)
// 			    		{
// 			    			console.log("Error or duplicate inserting director junction: "+err.stack);
// 			    		}
// 			    		else 
// 			    		{
// 			    			console.log("Inserted director junction");
// 			    		}
// 	    			});
// 				}
// 			}
// 			if(concert_array)
// 			{
// 				for(i=0; i<concert_array.length; i++)
// 				{
// 					concert_name = concert_array[i];

// 					sql = "INSERT IGNORE INTO concert SET name = '"+concert_name+"'";
// 					connection.query(sql, function(err, result) {
// 				    	if(err)
// 				    	{
// 				    		console.log("Error or duplicate inserting concert: "+err.stack);
// 				    	}
// 				    	else 
// 				    	{
// 				    		console.log("Inserted concert");
// 				    	}
// 			    	});

// 					sql = "INSERT IGNORE INTO arrangement_concert (arrangement_id, concert_id) VALUES("+newArrangementId+", (SELECT id FROM concert WHERE name = '"+concert_name+"'))";
// 	    			connection.query(sql, function(err, result) {
// 			    		if(err)
// 			    		{
// 			    			console.log("Error or duplicate inserting concert junction: "+err.stack);
// 			    		}
// 			    		else 
// 			    		{
// 			    			console.log("Inserted concert junction");
// 			    		}
// 	    			});
// 				}
// 			}
// 		}
// 		callback(err, result);
// 	});
// }
//var express = require('express');
var connection = require('./connection');
var arrangement = require('./arrangement');
  // Just me testing things out.
dbconnection = connection.createConnection();
connection.openConnection(dbconnection);

arrangement.getPage(dbconnection, 1, function(err, val)
{
	console.log(val);
});

connection.closeConnection(dbconnection);

//addAllToArrangement(connection, "dummy's name","dummy artist",1901,"Fall 1902",10,1,"dummy genre",1,"","","","","","","","",1,"dummy notes",1,"f/dum",true,4,["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"],["Warren Lowell","Jordan Toth", "H. Michael Newman"], function(){
//	console.log("Here");
//});


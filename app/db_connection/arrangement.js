var pageSize = 200;
module.exports = {

	// WARNING: DO NOT CALL CLOSECONNECTION() RIGHT AFTER THIS. WAIT AT LEAST A SECOND.
	// OTHERWISE MANY-TO-MANY TABLES WILL NOT BE UPDATED USING THE NEW ARRANGEMENT ID AS THE CALLBACK FUNCTION WILL NOT BE FINISHED.
	// Formerly
	insertForAllFields: function (connection, name, artist_name, original_song_year, arranged_semester_name, quality, reception, genre, arrangement_type_id, nickname, has_syllables, pdf_url, finale_url, youtube_url, blown_pitch_id, difficulty, has_choreo, solo_voice_part_id, notes, song_key_id, recording_url, active, number_of_parts, arranger_array, semester_array, soloist_array, director_array, concert_array, callback)
	{
		if(artist_name)
		{
			sql = "INSERT IGNORE INTO artist SET name = "+connection.escape(artist_name);
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
		}
		if(arranged_semester_name)
		{
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
		}

		sql = "INSERT INTO arrangement (name, original_song_year, quality, genre, nickname, pdf_url, finale_url, youtube_url, arranged_semester_id, reception, notes, difficulty, recording_url, song_key, pitch_blown, number_of_parts, solo_voice_part_id, has_choreo, active, has_syllables, artist_id, arrangement_type_id) VALUES(";
		if(!name)
		{
			name = null;
		}
		sql += connection.escape(name)+", ";
		if(typeof original_song_year !== 'number')
		{
			original_song_year = null;
		}
		sql += connection.escape(original_song_year)+", ";
		if(typeof quality !== 'number')
		{
			quality = null;
		}
		sql += connection.escape(quality)+", ";
		if(!genre)
		{
			genre = null;
		}
		sql += connection.escape(genre)+", ";
		if(!nickname)
		{
			nickname = null;
		}
		sql += connection.escape(nickname)+", ";
		if(!pdf_url)
		{	
			pdf_url = null;
		}
		sql += connection.escape(pdf_url)+", ";
		if(!finale_url)
		{
			finale_url = null;
		}
		sql += connection.escape(finale_url)+", ";
		if(!youtube_url)
		{
			youtube_url = null;
		}
		sql += connection.escape(youtube_url)+", ";
		if(arranged_semester_name)
		{
			sql += "(SELECT id FROM semester WHERE name = "+connection.escape(arranged_semester_name)+"), ";
		}
		else
		{
			sql += connection.escape(null)+", ";
		}
		if(typeof reception !== 'number')
		{
			reception = null;
		}
		sql += connection.escape(reception)+", ";
		if(!notes)
		{
			notes = null;
		}
		sql += connection.escape(notes)+", ";
		if(typeof difficulty !== 'number')
		{
			difficulty = null;
		}
		sql += connection.escape(difficulty)+", ";
		if(!recording_url)
		{
			recording_url = null;
		}
		sql += connection.escape(recording_url)+", ";
		if(typeof song_key_id !== 'number')
		{
			if (typeof song_key_id === "string") console.log("Song key string");
			song_key_id = null;
		}
		sql += connection.escape(song_key_id)+", ";
		if(typeof blown_pitch_id !== 'number')
		{
			if (typeof blown_pitch_id === "string") console.log("Blown pitch string");
			blown_pitch_id = null;
		}
		sql += connection.escape(blown_pitch_id)+", ";
		if(typeof number_of_parts !== 'number')
		{
			number_of_parts = null;
		}
		sql += number_of_parts+", ";
		if(typeof solo_voice_part_id !== 'number')
		{
			solo_voice_part_id = null;
		}
		sql += connection.escape(solo_voice_part_id)+", ";
		if(typeof has_choreo !== 'boolean')
		{
			has_choreo = null;
		}
		sql += connection.escape(has_choreo)+", ";
		if(typeof active !== 'boolean')
		{
			active = null;
		}
		sql += connection.escape(active)+", ";
		if(typeof has_syllables !== 'boolean')
		{
			has_syllables = null;
		}
		sql += connection.escape(has_syllables)+", ";
		if(artist_name)
		{
			sql += "(SELECT id FROM artist WHERE name = '"+artist_name+"'), ";
		}
		else
		{
			sql += connection.escape(null)+", ";
		}
		if(typeof arrangement_type_id !== 'number')
		{
			arrangement_type_id = null;
		}
		sql += connection.escape(arrangement_type_id)+")";
		connection.query(sql, function(err, result) {
			if(err)
			{
				console.log("Error inserting arrangement: "+err.stack);
			}
			else
			{
				console.log("Inserted arrangement");
				var newArrangementId = result.insertId;
				if(arranger_array)
				{
					for(i=0; i<arranger_array.length; i++)
					{
						arranger_name = arranger_array[i];
						if(arranger_name)
						{
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

							sql = "INSERT IGNORE INTO arrangement_arranger (arrangement_id, hangover_id) VALUES("+newArrangementId+", (SELECT id FROM hangover WHERE name = '"+arranger_name+"'))";
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
					}
				}
				if(semester_array)
				{
					for(i=0; i<semester_array.length; i++)
					{
						semester_name = semester_array[i];
						if(semester_name)
						{

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
					}
				}
				if(soloist_array)
				{
					for(i=0; i<soloist_array.length; i++)
					{
						soloist_name = soloist_array[i];
						if(soloist_name)
						{
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
					}
				}
				if(director_array)
				{
					for(i=0; i<director_array.length; i++)
					{
						director_name = director_array[i];
						if(director_name)
						{
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
					}
				}
				if(concert_array)
				{
					for(i=0; i<concert_array.length; i++)
					{
						concert_name = concert_array[i];
						if(concert_name)
						{
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
				}
			}
			callback(err, result);
		});
	},

	// NOTE: DOES NOT WORK ON ARRANGEMENTS REFERENCED BY OTHER TABLES DUE TO DATABASE CONFIGURATIONS. WILL FIX.
	deleteForId: function(connection, id, callback)
	{
		sql = "DELETE FROM arrangement WHERE id = " + connection.escape(id);
		connection.query(sql, callback);
	},

	/*
	* Queries the database, returning pageSize arrangements from the given pageNum
	* and passing them to callback(error, rows).
	*
	* @param connection  - a mysql connection object, must be open.
	* @param pageNum   - int, which set of pageSize arrangements you want.
	* @param callback    - a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - an array of row objects of the format fieldname:value
	*
	* NOTE: Page numbers are currently one-indexed. Jon, if you want them to be zero-indexed let me know.
	*/
	getPage: function (connection, pageNum, callback)
	{
		// It's null or zero or something
		pageNum = pageNum || 1;

		// The number of entries to skip before the first one we return
		offset = pageSize*(pageNum-1)
		sql = "SELECT arrangement.id, arrangement.name, artist.name AS artist_name FROM arrangement LEFT JOIN artist";
		sql += " ON arrangement.artist_id = artist.id ORDER BY arrangement.name LIMIT "+pageSize+" OFFSET "+offset+"";

		connection.query(sql, callback);
	},

	// getAllForConcert: function (connection, concert_id, callback)
	// {
	// 	sql = "SELECT a.id, a.name, b.name AS artist_name FROM arrangement a, artist b, concert c WHERE"
	// },

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
	getForField: function (connection, field, value, callback)
	{
		sql = "SELECT * FROM arrangement WHERE "+field+" = "+connection.escape(value);
		connection.query(sql, callback);
	},

	/*
	* Queries the database, returning all arrangements where id matches "id"
	* and passing them to callback(error, rows).
	*
	* @param connection	- a mysql connection object, must be open.
	* @param id			- the value to match.
	* @param callback 		- a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - a length 1 array of row objects of the format fieldname:value
	*/
	getForId: function (connection, id, callback)
	{
		this.getForField(connection, "id", id, callback);
	},

	/*
	* Queries the database, returning all hangovers who arranged the arrangement with id "id"
	* and passing them to callback(error, rows).
	*
	* @param connection	- a mysql connection object, must be open.
	* @param id			- the arrangement id to match.
	* @param callback 	- a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - an array of hangover name and id objects of the format fieldname:value
	*/
	getArrangersForId: function (connection, id, callback)
	{
		sql = "SELECT b.* FROM arrangement_arranger a, hangover b WHERE a.hangover_id = b.id AND a.arrangement_id = "+id;
		connection.query(sql, callback);
	},

	addArrangerForId: function(connection, arrangement_id, arranger_id, callback)
	{
		sql = "INSERT INTO arrangement_arranger (arrangement_id, arranger_id) VALUES("+connection.escape(arrangement_id)+", "+connection.escape(arranger_id)+")";
		connection.query(sql, callback);
	},

	deleteArrangerForId: function(connection, arrangement_id, arranger_id, callback)
	{
		sql = "DELETE FROM arrangement_arranger WHERE arranger_id = "+connection.escape(arranger_id);
		connection.query(sql, callback);
	},
	/*
	* Queries the database, returning all concerts where we performed the arrangement with id "id"
	* and passing them to callback(error, rows).
	*
	* @param connection	- a mysql connection object, must be open.
	* @param id			- the arrangement id to match.
	* @param callback 	- a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - an array of concert name and id objects of the format fieldname:value
	*/
	getConcertsForId: function (connecion, id, callback)
	{
		sql = "SELECT b.* FROM arrangement_concert a, concert b WHERE a.concert_id = b.id AND a.arrangement_id = "+id;
		connection.query(sql, callback);
	},

	addConcertForId: function(connection, arrangement_id, concert_id, callback)
	{
		sql = "INSERT INTO arrangement_concert (arrangement_id, concert_id) VALUES("+connection.escape(arrangement_id)+", "+connection.escape(concert_id)+")";
		connection.query(sql, callback);
	},

	deleteConcertForId: function(connection, arrangement_id, concert_id, callback)
	{
		sql = "DELETE FROM arrangement_concert WHERE concert_id = "+connection.escape(concert_id);
		connection.query(sql, callback);
	},

	/*
	* Queries the database, returning all hangovers who directed the arrangement with id "id"
	* and passing them to callback(error, rows).
	*
	* @param connection	- a mysql connection object, must be open.
	* @param id			- the arrangement id to match.
	* @param callback 	- a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - an array of hangover objects of the format fieldname:value
	*/
	getDirectorsForId: function (connecion, id, callback)
	{
		sql = "SELECT b.* FROM arrangement_director a, hangover b WHERE a.hangover_id = b.id AND a.arrangement_id = "+id;
		connection.query(sql, callback);
	},

	addDirectorForId: function(connection, arrangement_id, director_id, callback)
	{
		sql = "INSERT INTO arrangement_director (arrangement_id, director_id) VALUES("+connection.escape(arrangement_id)+", "+connection.escape(director_id)+")";
		connection.query(sql, callback);
	},

	deleteDirectorForId: function(connection, arrangement_id, director_id, callback)
	{
		sql = "DELETE FROM arrangement_director WHERE director_id = "+connection.escape(director_id);
		connection.query(sql, callback);
	},

	/*
	* Queries the database, returning all hangovers who soloed the arrangement with id "id"
	* and passing them to callback(error, rows).
	*
	* @param connection	- a mysql connection object, must be open.
	* @param id			- the arrangement id to match.
	* @param callback 	- a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - an array of hangover objects of the format fieldname:value
	*/
	getSoloistsForId: function (connecion, id, callback)
	{
		sql = "SELECT b.* FROM arrangement_soloist a, hangover b WHERE a.hangover_id = b.id AND a.arrangement_id = "+id;
		connection.query(sql, callback);
	},

	addSoloistForId: function(connection, arrangement_id, soloist_id, callback)
	{
		sql = "INSERT INTO arrangement_soloist (arrangement_id, soloist_id) VALUES("+connection.escape(arrangement_id)+", "+connection.escape(soloist_id)+")";
		connection.query(sql, callback);
	},

	deleteSoloistForId: function(connection, arrangement_id, soloist_id, callback)
	{
		sql = "DELETE FROM arrangement_soloist WHERE soloist_id = "+connection.escape(soloist_id);
		connection.query(sql, callback);
	},

	/*
	* Queries the database, returning all semesters when we performed the arrangement with id "id"
	* and passing them to callback(error, rows).
	*
	* @param connection	- a mysql connection object, must be open.
	* @param id			- the arrangement id to match.
	* @param callback 	- a callback function(err, rows)
	*    @param err  - any error thrown during the mysql fetch
	*    @param rows - an array of semester objects of the format fieldname:value
	*/
	getSemestersForId: function (connecion, id, callback)
	{
		sql = "SELECT b.* FROM arrangement_semester a, semester b WHERE a.semester_id = b.id AND a.arrangement_id = "+id;
		connection.query(sql, callback);
	},

	addSemesterForId: function(connection, arrangement_id, semester_id, callback)
	{
		sql = "INSERT INTO arrangement_semester (arrangement_id, semester_id) VALUES("+connection.escape(arrangement_id)+", "+connection.escape(semester_id)+")";
		connection.query(sql, callback);
	},

	deleteSemesterForId: function(connection, arrangement_id, semester_id, callback)
	{
		sql = "DELETE FROM arrangement_semester WHERE semester_id = "+connection.escape(semester_id);
		connection.query(sql, callback);
	},

	/*
	* Queries the database, returning all info for the semester during which arrangement with id "id" was arranged.
	*
	* Use an arrangement ID.
	*/
	getArrangedSemesterForId: function (connection, id, callback)
	{
		sql = "SELECT b.* FROM arrangement a, semester b WHERE a.arranged_semester_id = b.id AND a.id = "+connection.escape(id);
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
	searchForField: function (connection, field, value, callback)
	{
		sql = "SELECT * FROM arrangement WHERE "+field+" LIKE '%"+value+"%'";
		connection.query(sql, callback);
	},

	getForFields: function (connection, fieldArray, valueArray, callback)
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
	},

	/*
	* Note that you can't set the id field. That's static for a given song and passing an id in this object will throw an error
	*/
	setFieldsForId: function (connection, id, obj, callback)
	{
		sql = "UPDATE arrangement SET ";
		sql2 = "" // Store fields to change in separate string to make commas easier
		for (var key in obj)
		{
			if (obj.hasOwnProperty(key))
			{
				if(sql2) // Not first field, put a comma between the previous field and this one
				{
					sql2 += ", "
				}
				sql2 += key + " = " + connection.escape(obj[key]);
			}
		}
		sql += sql2 + " WHERE id = " + connection.escape(id);
		connection.query(sql, callback);
	},
};
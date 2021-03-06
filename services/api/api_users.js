var dbUtil = require('../utils/dbutil');
var authUtil = require('../utils/authUtil');
var bcrypt = require('bcryptjs');

const TABLE_USERS = ' ' + dbUtil.getDBName() + ".users" + ' ';

module.exports.validateUser = function (req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	dbUtil.query('SELECT * FROM  ' + TABLE_USERS + '  WHERE user_email = ?', [email], function(err, rows, fields) {
	   dbUtil.handleError(err);
	  if(!rows.length > 0)
	  {
	  	res.status(404).send("Invalid User");
	  	
	  	return;
	  }

	  // compare hash value
	  if(!bcrypt.compareSync(password, rows[0].user_password))
	  {
	  	res.status(404).send("Password doesn't match");

	  	return;
	  }

	  console.log('The validated user is: ', rows[0].user_name);

	  var result = {};
	  result.user_name = rows[0].user_name;
	  result.user_id = rows[0].user_id;

	  // validation passed, send jwt back to client
	  var token = authUtil.generateToken({
	  	user: {
	  		user_id: result.user_id
	  	}
	  });

	  result.token = token;

	  res.type('json');
	  res.send(JSON.stringify(result));
	  
	  return;
	});
}

module.exports.getUser = function (req, res, next) {

	var result = {};
	var userID = req.query.id;

	var queryStr = 
		' select * from' + TABLE_USERS + 
		' where users.user_id = ?';
	
	console.log(queryStr);
	dbUtil.query(queryStr,[userID], function(err, rows, fields) {
	  dbUtil.handleError(err);

	  result = rows[0];
	  res.type('json');
	  res.send(JSON.stringify(result));
	  
	  return;
	});
}

module.exports.getProfile = function (req, res, next) {
	var result = {};
	var userID = req.query.id;

	var queryStr = 
		' select users.user_name, users.user_email, users.user_avatarurl, users.user_phone, users.user_about, users.user_skills from' + TABLE_USERS + 
		' where users.user_id = ?';
	
	console.log(queryStr);
	dbUtil.query(queryStr,[userID], function(err, rows, fields) {
	  dbUtil.handleError(err);

	  result = rows[0];
	  res.type('json');
	  res.send(JSON.stringify(result));
	  
	  return;
	});
}

module.exports.addUser = function (req, res, next) {
	var userData = {
		email: "",
		password: "",
		username: "",
		avatarurl: "",
		phone: "",
		about: "",
		skills: ""
	};

	userData = Object.assign(userData, req.body);
	// encrypt password
	var salt = bcrypt.genSaltSync(10);
	userData.password = bcrypt.hashSync(userData.password, salt);

	var result = {};
	dbUtil.query('INSERT INTO ' + TABLE_USERS + '(user_name, user_email, user_password, user_avatarurl, user_phone, user_about, user_skills) VALUES(?, ?, ?, ?, ?, ?, ?) ',
		[userData.username, userData.email, userData.password, userData.avatarurl, userData.phone, userData.about, userData.skills] , 
		function(err, rows, fields) {
		  dbUtil.handleError(err);
		  res.type('json');
		  result = {status: "success"};
		  res.send(JSON.stringify(result));
		  
		  return;
	});
}

module.exports.updateUser = function (req, res, next) {
	var userData = {
		userID: "",
		userName: "",
		userEmail: "",
		userPhone: "",
		userAbout: "",
		userSkills: ""
	};

	userData = Object.assign(userData, req.body);

	var result = {};
	var queryStr = 
		' update' + TABLE_USERS + 'set user_name = ?, user_email = ?, user_phone = ?, user_about = ?, user_skills = ?' +
		' where users.user_id = ?';

	dbUtil.query(queryStr ,[userData.userName, userData.userEmail, userData.userPhone, userData.userAbout, userData.userSkills, userData.userID] , 
		function(err, rows, fields) {
		  dbUtil.handleError(err);
		  res.type('json');
		  result = {status: "success"};
		  res.send(JSON.stringify(result));
		  
		  return;
	});
}

module.exports.updateAvatar = function (req, res, next) {

	if(!req.body.id)
	{
		res.send(JSON.stringify({error: "Missing User ID"}));
		return;
	}
	if (req.file) {
		console.dir(req.file);
		var filePath = "/avatars/" + req.file.filename
	    var queryStr = 
		' update' + TABLE_USERS + 'set user_avatarurl = ?' +
		' where users.user_id = ?';

		dbUtil.query(queryStr ,[filePath, req.body.id] , 
			function(err, rows, fields) {
			  dbUtil.handleError(err);
			  res.type('json');
			  result = {avatarPath: filePath};
			  res.send(JSON.stringify({result}));
			  
			  return;
		});
	}
	else
	{
		res.send(JSON.stringify({error: "Missing File"}));
	}
	
}


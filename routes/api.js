const express = require('express');
const mOps = require('../mongoOps');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require("../config");
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/', function(req, res, next) {
  res.send('Express REST API');
});

router.post("/auth", function(req, res) {
	mOps.findUser(req.body.login).then(function (user){
	    if (!user) {
	      res.json({ success: false, message: 'Uwierzytelnianie nie powiodło się. Nie odnaleziono takiego użytkownika.' });
	    } else if (user) bcrypt.compare(req.body.password, user.password).then(function(auth) {
	      if (!auth) {
	        res.json({ success: false, message: 'Uwierzytelnianie nie powiodło się. Złe hasło.' });
	      } else {
	        var token = jwt.sign(user, config.secret, {
	          expiresIn : '24h'
	        });
	        user.password = undefined;
	        res.json({
	          success: true,
	          message: 'Uwierzytelnianie powiodło się!',
	          token: token,
	          user: user
	        });
	      }   
	    });
	},function(error) { 
		res.status(400).send('Error => '+error);
	});
});

router.use(function(req, res, next) {
	try{
	var token = req.body.token || req.query.token || req.headers['x-access-token'].replace(/^JWT\s/, '');
	}
	finally{
		if (token) {
			jwt.verify(token, config.secret, function(err, decoded) {      
				if (err) {
					return res.json({ success: false, message: 'Uwierzytelnianie tokenu nie powiodło się.' });    
				} else {
					req.decoded = decoded;    
					next();
				}
			});
		} else {
			return res.status(403).send({ 
					success: false, 
					message: 'Brak tokenu.' 
			});
		}
	}
});


router.get("/clients", function(req, res, next) {
	mOps.listCLients().then(function (doc){
		res.json(doc);
	},function(error) {  
		res.status(400).send(error.toString());
	});
});

router.get("/myclients/:search*?", function(req, res, next) {
	mOps.userClients(req.decoded._doc._id, req.params.search).then(function (doc){
		res.json(doc);
	},function(error) {  
		res.status(400).send(error.toString());
	});
});

router.get("/clients/:id", function(req, res, next) {
	mOps.singleClient(req.params.id).then(function (doc){
		res.json(doc);
	},function(error) { 
		res.status(400).send(error.toString());
	});
});

router.get("/sectors", function(req, res, next) {
	mOps.listSectors().then(function (doc){
		res.json(doc);
	},function(error) { 
		res.status(400).send(error.toString());
	});
	
});

router.get("/users", function(req, res, next) {
	mOps.listUsers().then(function (doc){
		res.json(doc);
	},function(error) { 
		res.status(400).send(error.toString());
	});
});

router.put('/clients/:id', function(req, res, next) {
    mOps.updateClient(req.body,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});
router.post('/clients/:id', function(req, res, next) {
    mOps.createClient(req.body,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});

router.delete('/clients/:id', function(req, res, next) {
    mOps.deleteClient(req.params.id,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});

router.post('/timelines', function(req, res, next) {
    mOps.createTimelineForClient(req.body,(doc,err)=>{
    	if(err){ 
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});

router.get("/timelines/:clientid", function(req, res, next) {
	mOps.getTimelinesForClient(req.params.clientid).then(function (doc){
		res.json(doc);
	},function(error) { 
		res.status(400).send(error.toString());
	});
});

router.get("/user/:id", function(req, res, next) {
	mOps.singleUser(req.params.id).then(function (doc){
		if(!doc){
			res.status(404).send("Nie znaleziono użytkownika !");
		}
		else{
			doc.password = undefined;
			res.json(doc);
		}
	},function(error) {  
		res.status(400).send(error.toString());
	});
});

router.post('/users', function(req, res, next) {
	if(req.decoded._doc.admin)
		if(req.body.password.length > 7)
			bcrypt.hash(req.body.password, saltRounds, function(error, hash) {
				if(error){
					res.status(400).send(error.toString());
					return;
				}
				req.body.password = hash;
				mOps.createUser(req.body,(doc,err)=>{
					if(err){
						res.status(400).send(err.toString());
						return;
					}
					res.json(doc);
				});
			});
		else res.status(400).send("Hasło za krótkie !");
	else res.status(403).send("Nie masz uprawnień do dodawania użytkowników !");
});

router.put('/users/:id', function(req, res, next) {
	if(req.decoded._doc.admin || req.body._id == req.decoded._doc._id){
		if(!req.decoded._doc.admin)req.body.admin = undefined;
    mOps.updateUser(req.body,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
		});
	}
	else res.status(403).send("Nie masz wystarczających uprawnień !");
});

router.delete('/users/:id', function(req, res, next) {
	if(req.decoded._doc.admin)
		if(req.decoded._doc._id!=req.params.id)
    mOps.deleteUser(req.params.id,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
		});
		else res.status(400).send("Usuwasz siebie ?");
	else res.status(403).send("Nie masz uprawnień do usuwania użytkowników !");
});

router.get("/users/:search", function(req, res, next) {
	mOps.findUsers(req.params.search).then(function (doc){
			doc.password = undefined;
			res.json(doc);
	},function(error) {  
		res.status(400).send(error.toString());
	});
});

router.put('/sector/:id', function(req, res, next) {
    mOps.updateSector(req.body,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});
router.post('/sector', function(req, res, next) {
		req.body._id = undefined;
    mOps.createSector(req.body,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});

router.delete('/sector/:id', function(req, res, next) {
    mOps.deleteSector(req.params.id,(doc,err)=>{
    	if(err){
				res.status(400).send(err.toString());
				return;
    	}
    	res.json(doc);
    });
});


module.exports = router;
var express = require('express'),
	User = require('../models/User'),
	auth = require('../middlewares/auth'),
	router = express.Router();

/* GET users listing. */
router.post('/login', auth.authenticate('local',{session:false}),function(req, res) {
  res.json(req.user);
});

router.post('/', function(req, res){
	res.json(req.body);
});


module.exports = router;

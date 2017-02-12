var express = require('express'),
	Post = require('../models/Post'),
	auth = require('../middlewares/auth'),
	Comment = require('../models/Comment'),
	ObjectId = require('mongoose').Schema.Types.ObjectId,
	router = express.Router();


router.get('/:id', function(req, res) {
	var _id = req.params.id;
	Post.findOne({ _id: _id },function(err, post) {
		if(err){
			throw err;
		} 
		if(!post){
			res.status(404).json({
				'messages' : {
					status: 404,
					message: 'Not found record with id ' + _id 
				}
			});
		} else {
			res.json({
				message: 'ok',
				data: post
			})
		}
	});
});

router.get('/:permalink', function(req, res) {
	var permalink = req.params.permalink;
	Post.findOne({ permalink: permalink}, function(err, post){
		if(err){
			throw err;
		}
		if(!post){
			res.status(404).json({
				messages: {
					status: 404,
					message: 'Not found'
				}
			});
		} else {
			res.json({
				message: 'ok',
				data: post
			})
		}
	});
});

router.post('/new', auth.authenticate('jwt', { session: false }), function(req, res){
	Post.create(req.body, function(err, post){
		if(err) {
			throw err;
		} 
		if(!post){
			res.status(500);
			res.json({
				messages: {
					status: 500,
					message: 'Internal Server Error' 
				}
			})
		} else {
			res.status(200).json({
				message: 'ok',
				data: post
			})
		}
	})
});

router.patch('/:id', auth.authenticate('jwt', { session: false }), function(req, res){
	var _id = req.params.id;
	Post.update({_id : _id}, req.body, function(err, result){
		if(err){
			throw err;
		} 
		if(!result){
			res.status(404);
			res.json({
				messages : {
					status: 404,
					message: 'Not Found'
				}
			})
		} else {
			res.json({
				message: 'ok',
				data: result
			})
		}
	});
});

router.delete('/:id', auth.authenticate('jwt', { session: false }), function(req, res){
	var _id = req.params.id;
	Post.remove({ _id: _id}, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.status(404);
			res.json(result)
		} else {
			res.status(200);
			res.json(result);
		}
	});
});

router.post('/:id/comments', function(req, res){
	var _id = req.params.id;
	var newComment = new Comment();
	newComment.content = req.body.content;
	console.log(newComment);
	Post.update({ _id: _id }, { $push : { comments: newComment }, $inc : { comment_count: 1 }  }, {upsert: true}, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.json(result);
		}
		else {
			res.json({
				message: 'ok',
				data: result
			})	
		}
	});
});

router.delete('/:id/comments/:commentId', auth.authenticate('jwt', { session: false }), function(req, res){
	var _id = req.params.id;
	var _commentId = req.params.commentId;
	console.log(_commentId);
	Post.update({ _id : _id}, { $pull: { comments: { 'comment_id' : _commentId }}}, { safe: true }, function(err, result){
		if(err){
			throw err;
		} 
		if(!result){
			res.status(404);
			res.json(result);
		}
		else {
			res.json(result);
		}
	})
});

router.get('/:id/comments/:start/:limit', function(req, res){
	var post_id = req.params.id;

	var start = +req.params.start;
	var limit = +req.params.limit;

	Post.find({ _id: post_id }, { comments: { $slice: [-1*start, limit]}}, { comments: true, comment_count: true }, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.json(result);
		}
		else {
			res.json({
				message: 'ok',
				data: result
			})
		}
	});
});


router.patch('/:id/like', function(req, res){
	var _id = req.params.id;
	Post.update({ _id: _id}, { $inc: { like_count: 1}}, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.json(result);
		} else {
			res.json({
				status: 'ok',
				data: result
			});
		}
	});
});

router.patch('/:id/unlike', function(req, res){
	var _id = req.params.id;
	Post.update({ _id: _id}, { $inc: { like_count: -1}}, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.json(result);
		} else {
			res.json({
				status: 'ok',
				data: result
			});
		}
	}); 
});

router.patch('/:id/comments/:comment_id/like', function(req, res){
	var _id = req.params.id;
	var _commentId = req.params.comment_id;
	Post.update({ _id: _id, 'comments.comment_id' : _commentId }, { $inc: { 'comments.like_count': 1}}, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.json(result);
		} else {
			res.json({
				status: 'ok',
				data: result
			});
		}
	}); 
});

router.patch('/:id/comments/:comment_id/unlike', function(req, res){
	var _id = req.params.id;
	var _commentId = req.params.comment_id;
	Post.update({ _id: _id, 'comments.comment_id' : _commentId }, { $inc: { 'comments.like_count': -1}}, function(err, result){
		if(err){
			throw err;
		}
		if(!result){
			res.json(result);
		} else {
			res.json({
				status: 'ok',
				data: result
			});
		}
	}); 
});

module.exports = router;
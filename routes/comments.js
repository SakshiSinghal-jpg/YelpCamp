var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware/index.js");

//==================================================
//Comment Routes
//==================================================

//Comments new
router.get('/new',middleware.isLoggedIn,function(req,res){
		// res.send("This will be the comment form!");
	//find campground by id
	Campground.findById(req.params.id,function(err,campground){
		if(err){
            console.log(err);
        }
        else
        {   
            res.render('comments/new',{campground:campground});
        }
	});
		// res.render("comments/new");
});

//comments create
router.post("/",middleware.isLoggedIn,function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id,function(err,campground)
    {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			// console.log(req.body.comment);
				Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					// console.log("New comment's username will be:"+req.user.username);
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("success","Successfully added comment");
				res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	//create new comment
	//conect a new comment to campground
	//redirect to campground show page
});
//Comment edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	// res.send("EDIT ROUTE FOR COMMENT");
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","No campground found");
			return res.redirect("back"); 
		}
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}
			else{
				res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
			}
		});
	});
});

	
//COMMENT'S UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	// res.send("YOU HIT THE UPDATE ROUTE");
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//COMMENT DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	// res.send("THIS IS THE DELETE ROUTE");
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
		req.flash("success","Comment deleted");	
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//middleware
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req,res,next){
// 	if(req.isAuthenticated()){	Comment.findById(req.params.comment_id,function(err,foundComment){
// 		if(err)
// 			{
// 				res.redirect("/campgrounds");
// 			}else{
// 				//does user own the comment?
// 				if(foundComment.author.id.equals(req.user._id)){
					
// 					// res.render("campgrounds/edit",{campground:foundCampground});
// 					next();
					
// 				}else{
// 					// res.send("YOU DO NOT HAVE PERMISSION TO DO THAT!");
// 					res.redirect("back");
// 				}
// 			}
// 	});
		
// 	}else{
// 		// console.log("YOU NEED TO BE LOGGED IN TO DO THAT");
// 		// res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!");
// 		res.redirect("back");
// 	}
// }
module.exports=router;

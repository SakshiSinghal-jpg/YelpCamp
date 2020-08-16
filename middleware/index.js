//All middleware goes here!!
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function(req,res,next){
	if(req.isAuthenticated()){	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground)
			{
				req.flash("error","Campground not found");
				res.redirect("/campgrounds");
			}else{
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					
					// res.render("campgrounds/edit",{campground:foundCampground});
					next();
					
				}else{
					// res.send("YOU DO NOT HAVE PERMISSION TO DO THAT!");
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
	});
		
	}else{
		// console.log("YOU NEED TO BE LOGGED IN TO DO THAT");
		// res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!");
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}
	

middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err || !foundComment)
			{
				req.flash("error","Comment not found");
				res.redirect("/campgrounds");
			}else{
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					
					// res.render("campgrounds/edit",{campground:foundCampground});
					next();
					
				}else{
					// res.send("YOU DO NOT HAVE PERMISSION TO DO THAT!");
					req.flash("You don't have permission to do that");
					res.redirect("back");
				}
			}
	});
		
	}else{
		// console.log("YOU NEED TO BE LOGGED IN TO DO THAT");
		// res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!");
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}
	
module.exports=middlewareObj;
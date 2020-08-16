var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index.js");
//INDEX-show all campgrounds
router.get("/",function(req,res)
	   {
	// console.log(req.user);
	// 	Get all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			 res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
		}
	});
	// res.render("campgrounds",{campgrounds:campgrounds});
});

//CREATE-add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res)
		{
	var name=req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var desc=req.body.description;
	var newCampground={name:name,price:price,image:image,description:desc,author:author};
	// console.log(req.user);
	// campgrounds.push(newCampground);
	//Create a new campground and save to the database
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});
//NEW-show form to create new campgrounds(should be declared first because of show route)
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
//SHOW- shows more info about one campground
router.get('/:id',function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCampground){
        if(err || !foundCampground){
            // console.log(err);
			req.flash("error","Campground not found");
			res.redirect("back");
		}
        else
        {   console.log(foundCampground);
            res.render('campgrounds/show',{campground:foundCampground});
        }
    });
      
});

//EDIT  CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	// res.send("EDIT CAMPGROUND ROUTES");
	//is user logged in 
Campground.findById(req.params.id,function(err,foundCampground){
					
					res.render("campgrounds/edit",{campground:foundCampground});
					
	});
});
//UPDATE CAMPGROUND ROUTE

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
	//redirect somewhere(show page)
});

//DESTROY CAMPGROUND ROUTES
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	// res.send("YOU ARE TRYING TO DELETE SOMETHING!");
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});


// middleware
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCampgroundOwnership(req,res,next){
// 	if(req.isAuthenticated()){	Campground.findById(req.params.id,function(err,foundCampground){
// 		if(err)
// 			{
// 				res.redirect("/campgrounds");
// 			}else{
// 				//does user own the campground?
// 				if(foundCampground.author.id.equals(req.user._id)){
					
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
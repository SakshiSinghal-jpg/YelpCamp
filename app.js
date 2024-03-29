var express			=require("express"),
	 app            =express(),
	 bodyParser		=require("body-parser"),
	flash           =require("connect-flash"),
	mongoose		=require("mongoose"),
	passport        =require("passport"),
	LocalStrategy   =require("passport-local"),
	methodOverride  =require("method-override"),
	Campground		=require("./models/campground"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
	seedDB			=require("./seed")

//requiring routes
var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes	=require("./routes/index")

// mongoose.connect(process.env.DATABASEURL);

mongoose.connect("mongodb+srv://sakshi:khushi@2003@cluster0.q8yko.mongodb.net/<dbname>?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex:true
}).then(()=>{
	console.log('Connected to DB!');
}).catch(err =>{
	console.log('ERROR:',err.message);
});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Once again Rusty wins the cutest dog!",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function()
		  {
	console.log("YelpCamp Server Has Started");
});

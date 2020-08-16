var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
	{
		name:"Cloud's Rest",
		image:"https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description:"The scenery is gorgeous, and there is plenty of exotic wildlife to check out, like monkeys, Ethiopian wolves, and rare birds. You can hike jagged cliffs and deep precipices, but the best way to explore the park is to camp there."
	},
	{
		name:"Desert Mesa",
		image:"https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
	description:"If you want a unique and beautiful experience, Coastal Gaze glamping pods are the way to go.These pods allow you to indulge in luxury camping with stunning views of St. Michael's Mount and Mounts Bay near Cornwall.The pods are equipped with a kitchen area, a bathroom with a shower, and a beautiful deck to enjoy the views at any time of day. "
	},
	{
		name:"Canyon Floor",
		image:"https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
	description:"If sleeping in a tent on the floor isn't your thing but you still feel intrigued by camping, you should try glamping.One of the best places to do that is Canyon floor. Canyon Floor uses geodesic domes that are comfortable, but still give you the feel of being outdoors. The sites are located at the foot of the Torres del Paine National Park, which will give you an incredible view of the mountain peaks."
	}
]
function seedDB(){
	//Remove all campgrounds
	Campground.remove({},function(err){
	if(err){
		console.log(err);
	}
		console.log("removed campgrounds!");
		//add a few campgrounds
	data.forEach(function(seed){
		Campground.create(seed,function(err,campground){
			if(err){
				console.log(err);
			}else{
				console.log("Added a campground!");
				//create a comment
				Comment.create(
					{
						text:"This place is great,but I wish there was internet ",
						author:"Homer"
					},function(err,comment){
						if(err){
							console.log(err)
						}else{
						campground.comments.push(comment);
						campground.save();
						console.log("Created new comment!");
						}
					});
			}
		})
	});
	});
}
module.exports=seedDB;

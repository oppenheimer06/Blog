//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs=require("fs");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate=require("mongoose-findorcreate");
const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret:"Our Little secret.",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());




const homeStartingContent = "Many people look for ways to expand their online presence and while one of the most popular strategies is launching a blog, not everyone knows what is a blog and how to start one.When blogs first emerged around 1994, people used them mainly to share their personal lives, including their experiences and interests. Now, blogs have become an essential online marketing strategy for businesses and one of the most profitable career choices for individuals.There are many reasons to start a blog for personal use and only a handful of strong ones for business blogging. Blogging for business, projects, or anything else that might bring you money has a very straightforward purpose – to rank your website. As a new business, you rely on blogging to help you get to potential consumers and grab their attention. Without blogging, your website would remain invisible, whereas running a blog makes you searchable and competitive.So, the main purpose of a blog is to connect you to the relevant audience. Another one is to boost your traffic and send quality leads to your website.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const greatblog="If you've ever met with investors and made an elevator pitch—a quick two-minute presentation about your business—you know that the goal isn’t to get funding right then and there, but to deliver enough information so that the investors will want to hear more.If you plan to create your own blog, it is helpful to know what makes an excellent one in the first place. Typically, you can expect to find the following elements in successful blogs:High-quality blog content. The content should demonstrate expertise, authoritativeness, and trustworthiness (EAT). It is also important to use easy-to-understand language and formatting to make the blog post digestible.";
const blogvswebsite="A blog is typically a section of your business's website — but, unlike the rest of your website, you need to update the blog section frequently by adding new posts. Additionally, your blog is a tool that allows you to engage more with an audience, either by analyzing how many readers share your blog posts on social, or by allowing readers to comment on your individual posts. In this way, a blog is more like a two-way conversation than the rest of your website.";

mongoose.connect("mongodb+srv://admin-yug:shiva963423@cluster0.upnpywb.mongodb.net/blogDB");

const  blogSchema=new mongoose.Schema({
  username:String,
  googleId:String,
  profile_img:String,
  content:[]
});

blogSchema.plugin(passportLocalMongoose);
blogSchema.plugin(findOrCreate);

const User=mongoose.model("User",blogSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
    

passport.use(new GoogleStrategy({
  clientID: 216727738504-rrbv7ua64suv9bqe027k4gb37kgd9of0.apps.googleusercontent.com,
  clientSecret: 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,
  callbackURL: "http://localhost:3000/auth/google/blog",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id ,username:profile.displayName,profile_img:profile.photos[0].value.slice(0,-6)}, function (err, user) {
    return cb(err, user);
  });
}
));

  


app.get("/",function(req,res){
  User.find()
  .then(function(foundUser){
      res.render("home",{Users:foundUser});
  })
  .catch(function(err){
      console.log(err);
  })
})


app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] }
));

app.get('/auth/google/blog', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
 
app.get("/Home",function(req,res){
res.render("post",{postTitle:"Home",postContent:homeStartingContent,postImg:"https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy-vector-isolated-concept-metaphor-illustration_335657-855.jpg"})
})


app.get("/greatblog",function(req,res){
  res.render("post",{postTitle:"What Makes a Blog Great??",postContent:greatblog,postImg:"https://ulearning.com/wp-content/uploads/2019/02/d4c259205d3859327c6b4be85450070e.jpeg"})
  })
  
app.get("/blogvswebsite",function(req,res){
    res.render("post",{postTitle:"Blog VS Website",postContent:blogvswebsite,postImg:"https://wbcomdesigns.com/wp-content/uploads/2018/08/Blog-Vs-Website.jpg"})
})
    

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
  if(req.isAuthenticated()){
  res.render("compose");
  } else{
    res.render("auth");
  }
});

app.get("/logout",function(req,res){
  req.logOut(function(){
    res.redirect("/");
})
})

app.get("/posts/:topic",function(req,res){
const id=req.params.topic.slice(0,-1);
const number=req.params.topic.slice(-1);
User.findById(id)
.then(function(foundUser){
  res.render("post",{user:foundUser,number:number});
})
  .catch(function(error){
    console.log(error);
  })
})





app.get("/search",function(req,res){
 User.find()
 .then(function(foundUser){
  res.render("search",{users:foundUser})
 })
})


app.get("/user",function(req,res){
  res.render("soon")
 })


 app.get("/profile",function(req,res){
  if(req.isAuthenticated()){
    User.findById(req.user.id)
    .then(function(profilePage){
      res.render("profile",{profile:profilePage});
    })
    .catch(function(err){
      console.log(err);
    });
    } else{
      res.render("auth");
    }
 })

app.post("/compose", function(req,res){
  const post={
    title:req.body.postTitle,
    secret:req.body.postBody
  }
  User.findById(req.user.id)
  .then(function(foundUser){
    foundUser.content.push(post);
      foundUser.save()
      .then(function(){
          res.redirect("/");
      })
  })
  .catch(function(err){
      console.log(err)
  })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});



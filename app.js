var express                 =   require("express"),
    app                     =   express(),
    mongoose                =   require("mongoose"),
    bodyParser              =   require("body-parser"), 
    User                    =   require("./models/users.js"),
    journeys                =   require("./models/journeys.js"),
    passport                =   require("passport"),
    LocalStrategy           =   require("passport-local"),
    journeysRoutes          =   require("./routes/journeysRoutes.js"),
    commentsRoutes          =   require("./routes/commentsRoutes.js"),
    usersRoutes             =   require("./routes/usersRoutes.js"),
    searchRoutes            =   require("./routes/searchRoutes.js"),
    plannerRoutes           =   require("./routes/plannerRoutes.js"),
    methodOverride          =   require("method-override");
  

    app.use(require("express-session")({
    secret: "Journey code",
    resave: false,
    saveUninitialized: false
}));



app.use(methodOverride("_method"));

var url = process.env.DATABASEURL || "mongodb://localhost/journey_app";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs" );

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//decode and endcode sessions for Authorization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set req.user as currentUser to be used in views/headesr
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.get("/newJourney",function(req,res){
    
    res.render("newJourney/newJourney",{ page:'newJourney'});
});






app.use(plannerRoutes);
app.use(journeysRoutes);
app.use(commentsRoutes);
app.use(usersRoutes.router);
app.use(searchRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Journey has started ");
});


const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var name =[];
var ein =[];
var state=[];
var city=[];
var postalCode=[];
var streetAddress=[];
var charityURL=[];

app.get("/", function(req,res){
  res.sendFile(__dirname+"/index.html");
});

app.get("/list", function(req,res){
  res.render("list",{name:name,ein:ein,state:state,city:city,postalCode:postalCode,streetAddress:streetAddress,charityURL:charityURL});
});

app.post("/", function(req,res){
  var url = "https://api.data.charitynavigator.org/v2/Organizations?app_id=1f9990de&app_key=0128099e52a4fb5eef01955eafaba778";

  if(req.body.category.includes("all") == false){
    var category_api =req.body.category;
    url = url+category_api;
  }
  if(req.body.state.includes("all") == false){
    var state_api = "&state="+req.body.state;
    url = url+state_api;
  }
  if(req.body.city!= ""){
    var city_api = "8&city="+req.body.city;
    url = url+city_api;
  }

  if(req.body.dpp == "on"){
    var dpp_api = "&donorPrivacy=true";
    url = url+dpp_api;
  }

  if(req.body.rating.includes("all") == false){
    var rating_api = "&minRating="+req.body.rating+"&maxRating="+req.body.rating;
    url = url+rating_api;
  }
  if(req.body.size.includes("all") == false){
    var size_api = "&sizeRange="+req.body.size;
    url = url+size_api;
  }
  if(req.body.sow.includes("all") == false){
    var sow_api = req.body.sow;
    url = url+sow_api;
  }

  request(url, function(error,response,body){

    var data = JSON.parse(body);
    for (i=0;i<data.length;i++){
      name.push(data[i].charityName);
      ein.push(data[i].ein);
      if (data[i].mailingAddress.stateOrProvince == null){
        state.push("");
      }
      else{
        state.push(data[i].mailingAddress.stateOrProvince);
      }

      if (data[i].mailingAddress.city == null){
        city.push("");
      }
      else{
        city.push(data[i].mailingAddress.city);;
      }

      if (data[i].mailingAddress.postalCode == null){
        postalCode.push("");
      }
      else{
        postalCode.push(data[i].mailingAddress.postalCode);
      }

      if (data[i].mailingAddress.streetAddress1 == null){
        streetAddress.push("");
      }
      else{
        streetAddress.push(data[i].mailingAddress.streetAddress1);
      }

      if (data[i].charityNavigatorURL == null){
        charityURL.push("");
      }
      else{
        charityURL.push(data[i].charityNavigatorURL);
      }
    }
    res.redirect("/list");
  });
});

app.listen(process.env.PORT || 3000, function() {
});

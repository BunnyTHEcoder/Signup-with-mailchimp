const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const path =require("path")


app.use(express.static(path.join(__dirname,"..","public")));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/*" , function(req,res){
    res.sendFile(path.join(__dirname,"public","index.html"));
})
app.post("/" , function(req,res){
    const fn = req.body.fname;
    const ln = req.body.lname;
    const em = req.body.email;
    const data = {
        members:[
            {
                email_address : em ,
                status : "subscribed" ,
                merge_fields : {
                    FNAME : fn ,
                    LNAME : ln
                }
            }
        ]
    }
    const JSONdata = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/96cec4c4fe";
    const options = {
        method : "POST",
        auth:`${process.env.MAILCHIMP}`
        // auth:"suraj20:dcca229a291b60df08969d730ee4d596-us21"
    }
    
    const request = https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(JSONdata);
    request.end();
})
app.post("/failure" , function(req,res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000 , function(){
    console.log("server started");
})

// df80de3fe67d4d8d533c13a2d8050c38-us21
// 96cec4c4fe
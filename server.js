const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

const app = express();

// listen for requests
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000")
});


const DB='mongodb+srv://suhani:suhani@cluster0.ghoxh.mongodb.net/Database?retryWrites=true&w=majority'
mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false
}).then(()=>{
  console.log('connection done');
}).catch((err)=>console.log('no connection',err));


var Schema = mongoose.Schema;

var register = new Schema({
   fname:String,
   lname: String,
   dob:String,
   email: String,
   pass: String
},{
  collection: 'RegisterNow'
});

var signin = new Schema({
   email: String,
   pass: String
},{
  collection: 'Signin'
});

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

var Register = mongoose.model('Register',register);
var SignIn = mongoose.model('SignIn',signin);

app.post('/',(req,res)=>{
  const {fname,lname,dob,email,pass} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pass, salt);

          new Register({
            fname:fname,
            lname:lname,
            dob:dob,
            email:email,
            pass:hash
          })
          .save((err,doc)=>{
            if(err){
              res.json(err)
            }
            else{
              res.json("Success");
            }
          })

     })



app.post('/signin',(req,res)=>{
  const {email,pass} = req.body;
  Register.find(
    (err,doc)=>{
    if(err){
      console.log(err);
      res.json(err)
    }
    else{
      console.log(doc);
     doc.map((i,index)=>{

       if(i.email===email){
        if(bcrypt.compareSync(pass,i.pass))
        {
          res.json({email:email})
          console.log(email);
        }
        else{
          res.json("wrong");
        }
       }
      
     })
    }
  })

})

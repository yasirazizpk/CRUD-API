const express = require ('express');
const app = express();
const mongoose = require ('mongoose');
app.use(express.json());

//db connection
mongoose.connect("mongodb://localhost:27017/mynewdb",{
    useNewUrlParser:true,
    useUnifiedTopology: true
},(err) =>{
    if (!err){
        console.log('connected to db')
    }else{
        console.log("error")
    }
})

//schema
const sch = {
    name :String,
    email : String,
    id : Number
}
const monmodel = mongoose.model("Newschema", sch);

//post request

app.post ("/post",async (req,res) => {
    console.log ('we are posting data');

    const data = new monmodel ({
        name : req.body.name,
        email : req.body.email,
        id : req.body.id
    });
    const val = await data.save();
    res.send("post request submitted");
})

//put 
app.put("/update/:id", async(req, res) => {

    let upid = req.params.id;
    let upname= req.body.name;
    let upemail=req.body.email;

     monmodel.findOneAndUpdate({id:upid},{$set:{name:upname,email:upemail}},
        {new:true},(err,data) => {
        if (err){
            res.send("ERROR");
        }
        else{
          if (data==null){
            res.send("Nothing found")
          }else{
            res.send(data)
          }
        }
     })


})

//fetch get
   app.get ("/fetch/:id" , function(req,res){
    fetchid=req.params.id;
    monmodel.find(({id:fetchid}), function (err, val){
          
        if(err){
            res.send("error");
        }else{

        if(val.length==0){
            res.send("data does not exist");
        }else{
            res.send(val);
        }
    }
    })
   })
   //delete
   app.delete("/delete/:id", function(req,res){
     
    let delid=req.params.id;
    monmodel.findOneAndDelete(({id:delid}),function(err,docs){
        if (err){
            res.send("error");
        }
        else{
 
        if(docs==null){
            res.send("enter valid id");
        }
        else{
           res.send(docs);
        }
    }
    })

   })

app.listen(3000, () => {
    console.log('on port 3000')
});
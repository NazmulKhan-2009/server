const express = require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const fileUpload=require('express-fileupload')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnbwm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('services'));
app.use(fileUpload())


const port = 4000

app.get("/" , (req, res)=>{
  console.log( "vi mongo ki hoise no change pp")
  res.send("!! DB TESTING TESTING!!!!")
})

const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("creativeAgency").collection("services");
 
  const purchaseCollection = client.db("creativeAgency").collection("purchase");
  const reviewsCollection = client.db("creativeAgency").collection("review");

  app.post('/addService',(req, res)=>{
    const file=req.files.file
    const name=req.body.name
    const description=req.body.description
    console.log( name, description, file)
 
    file.mv(`${__dirname}/services/${file.name}`, err=>{
        if(err){
            console.log( err);
            return res.status(500).send({msg:"Failed To upload image in the server"});
        }

        servicesCollection.insertOne({ name:name, description:description, img:file.name })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
        // return res.send({name:file.name, path:`/${file.name}`})
    })

  }) 

  app.get('/services', (req, res) => {
    servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});


app.post('/serviceAdd' , (req, res) => {

  const getService=req.body

  purchaseCollection.insertOne(getService)
  .then(result => {
    res.send(result.insertedCount > 0);
})

})

  app.get('/serviceList', (req, res)=>{
    purchaseCollection.find({email:req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.post('/reviews',(req, res)=>{
    const file=req.files.file
    const name=req.body.name
    const coname=req.body.coname
    const description=req.body.description
    console.log( name, description, file)
 
    file.mv(`${__dirname}/services/${file.name}`, err=>{
        if(err){
            console.log( err);
            return res.status(500).send({msg:"Failed To upload image in the server"});
        }

        reviewsCollection.insertOne({ name:name, coname:coname, description:description, img:file.name })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
        // return res.send({name:file.name, path:`/${file.name}`})
    })

  }) 

  app.get('/reviews' , (req, res)=>{
    reviewsCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })





});

app.listen(process.env.PORT || port)
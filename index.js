const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express=require('express')
const cors=require('cors')
require('dotenv').config();
const port=process.env.PORT || 4545;
const app=express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('server is running')
})

// git config http.postBuffer 524288000


const uri =`mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.oypj9vn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("craftsDB");
    const craftsCollection= database.collection('crafts')
    // console.log(craftsCollection);

    app.get('/crafts/:id',async(req,res)=>{
      let id=req.params.id
      const query={_id:new ObjectId(id) }
      let result =await craftsCollection.findOne(query)
      res.send(result)
      console.log(result);
    })

    // find many wise email 

    // app.get('/crafts/:email',async(req,res)=>{
    //   let email=req.params.email
    //   let query={email:email}
    //   // let result = craftsCollection.find(query)
    //   // res.send(result)

    //   let cursor= craftsCollection.find(query)
    //   let result=await cursor.toArray()
    //   res.send(result)
    //   // console.log(email);
    //   // let query= { email:  email  };
    //   // let cursor =await craftsCollection.find(query)
    //   // // let result =await cursor.toArray()
    //   // res.send(cursor)
    //   // console.log(cursor);

    // })

    app.get('/crafts',async(req,res)=>{
      let cursor= craftsCollection.find()
     let result=await cursor.toArray()
     res.send(result)
    })



    app.post('/crafts',async(req,res)=>{
      
      const result = await craftsCollection.insertOne(req.body);

      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir); 


app.listen(port,(req,res)=>{
    console.log(`server is running in PORT: ${port}`);
})
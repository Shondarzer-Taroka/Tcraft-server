const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 4545;
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('server is running')
})


// git config http.postBuffer 524288000


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.oypj9vn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const craftsCollection = database.collection('crafts')
    const mysubcategory = client.db("subcategoryDB");
    const categoryCollection = mysubcategory.collection('category')
    // console.log(craftsCollection);


    // subcategory found

    app.get('/subcategorydata',async(req,res)=>{
      let cursor = categoryCollection.find();
      let result = await cursor.toArray();
      res.send(result);
    })


    app.get('/mycrafts/:email',async(req,res)=>{
      console.log(req.params); 
      const result = await craftsCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    app.get('/crafts/:email',async(req,res)=>{
      console.log(req.params); 
      const result = await craftsCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })
 
    
    
    app.get('/crafts/:id', async (req, res) => {
      let id = req.params.id
      const query = { _id: new ObjectId(id) }
      let result = await craftsCollection.findOne(query)
      res.send(result)
      // console.log(result);
    })

    app.get('/viewdetails/:id', async (req, res) => {
      let id = req.params.id
      const query = { _id: new ObjectId(id) }
      let result = await craftsCollection.findOne(query)
      res.send(result)
      // console.log(result);
    })
   
  

    // find many wise email 


    app.get('/crafts', async (req, res) => {
      let cursor = craftsCollection.find()
      let result = await cursor.toArray()
      res.send(result)
    })

    app.get('/allcraft', async (req, res) => {
      let cursor = craftsCollection.find()
      let result = await cursor.toArray()
      res.send(result)
    })
    app.get('/craftitems', async (req, res) => {
      let cursor = craftsCollection.find()
      let result = await cursor.toArray()
      res.send(result)
    })

  
    app.post('/crafts', async (req, res) => {
      const result = await craftsCollection.insertOne(req.body);
      res.send(result)
      console.log(result);
    })


    
  

    app.put('/update/:id', async(req, res) => {
      let item = req.body
      let id = req.params.id
      let filter = { _id: new ObjectId(id) }
      let options = { upsert: true }
      let updatedItem = {
        $set: {
              image:item.image,
              item_name:item.item_name,
              subcategory_Name:item.subcategory_Name,
              price:item.price,
              rating:item.rating,
              customization:item.customization,
              processing_time:item.processing_time,
              stockStatus:item.stockStatus
        }
      }
      let result =await craftsCollection.updateOne(filter,updatedItem,options)
      res.send(result)
    })

    



    app.delete('/crafts/:id',async(req,res)=>{
      let id=req.params.id 
      let item=req.body
      let query= {_id:new ObjectId(id)}
      let result= await craftsCollection.deleteOne(query)
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


app.listen(port, (req, res) => {
  console.log(`server is running in PORT: ${port}`);
})
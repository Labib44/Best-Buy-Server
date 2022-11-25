const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewer
app.use(cors());
app.use(express.json());


// Database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r6wv8dh.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const categorysCollection = client.db('best-buy').collection('categorys');
        const productsCollection = client.db('best-buy').collection('products');
        const bookingsCollection = client.db('best-buy').collection('bookings');



        // categorys
        app.get('/categorysCollection', async (req, res) => {
            const query = {};
            const result = await categorysCollection.find(query).toArray();
            res.send(result);
        });
        // all product
        app.get('/productsCollection', async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/productsCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const category = await categorysCollection.findOne(query);
            const filter = { category: category.category }
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
        });
        app.get('/categorysCollection', async (req, res) => {
            const query = {}
            const result = await categorysCollection.find(query).toArray()
            res.send(result);
        });

        // bookings product
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/bookings', async(req, res)=>{
            const email=req.query.email;
            const query={email:email};
            const bookings=await bookingsCollection.find(query).toArray();
            res.send(bookings);
        })



    }
    finally {

    }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send('Best Buy LTD server')
});

app.listen(port, () => {
    console.log(`Best Buy server on going ${port}`);
})
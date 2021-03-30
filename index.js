const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// const d = process.env.DB_PASS;
// console.log(d);
const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 4055;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkcgo.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteer").collection("events");

    //create data
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log('adding new event: ', newEvent);
        eventCollection.insertOne(newEvent)
        .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount > 0)
        })
    })

    //read data
    app.get('/events', (req, res) => {
      eventCollection.find()
      .toArray((err, items) => {
        res.send(items);
        // console.log('from database', items);
      })
    })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
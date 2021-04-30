const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; 
const bodyParser = require('body-parser');
const cors = require('cors');
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

    //delete data
    app.delete('/deleteEvent/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      console.log('delete this', id);
      eventCollection.findOneAndDelete({_id: id})
      .then(documents => res.send(!!documents.value))
    })
});


app.get('/', (req, res) => {
  res.send('volunteer!')
})

app.listen(process.env.PORT || port);
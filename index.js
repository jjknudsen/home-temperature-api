require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongojs = require('mongojs');
const moment = require('moment');
const { parse } = require('json2csv');
var bodyParser = require('body-parser');

const app = express();
app.use(morgan('combined'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let mongoHost = (process.env.DB_HOST);
let database = (process.env.DATABASE);
let collectionName = (process.env.DB_COLLECTION);
let connectionString = `mongodb://${mongoHost}/${database}`;
var db = mongojs(connectionString, [collectionName]);
const temps = db.collection(collectionName)

let dateFormat = "YYYY-MM-DD";
let hourFormat = "HH:mm:ss";

db.on('error', function (err) {
    console.log('database error', err)
})

db.on('connect', function () {
    console.log('database connected')
})

// function compare(a, b) {
//     var comparison = 0;
//     if ( a.timestamp < b.timestamp ){
//         comparison = -1;
//     } else if ( a.timestamp > b.timestamp ){
//         comparison = 1;
//     }
    
//     return comparison;
// }

var port = (process.env.PORT || '3001');
app.use(bodyParser.json());

// app.get('/', (req, res, next) => {

//     var options = {fields: ['-devices', '-_id'], sort : {date: 1}};

//     if (req.query.lastCount) {
//         options.limit = parseInt(req.query.lastCount);
//         options.sort = {date: -1};
//     }

//     if (req.query.usageOnly) {
//         options.fields = ['-_id', 'date', 'totalUsage'];
//     } 

//     tempLogger.find({}, options).then((docs) => {
//         // docs.sort(compare);
        
//         if (req.query.csv) {
//             let keys = Object.keys(docs[0]);
//             let csv = parse(docs, {keys});
//             res.send(csv);
//         } else {
//             res.send(docs);
//         }
        
//     });
// });


app.post('/record', (req, res, next) => {
    var data = req.body;
    data.date = new Date();
    console.log(`Inserting record for date ${data.date}`);
    
    temps.insert(data, function (error) {

        if (error) {
            console.log('There was a problem adding the information to the database.');
            console.log(error);
            res.statusCode = 500;
            res.send('Failed to save data in database. See logs');
        } else {
            res.statusCode = 201;
            res.send({success: true});
        }

    });

});

app.listen(port, () =>
  console.log(`${moment().toString()} Server listening on port ${port.toString()}!`)
);
 

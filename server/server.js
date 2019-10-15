const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mustache = require('mustache-express');
const hbs = require('handlebars');

const moment = require('moment');

const publicPath = path.join(__dirname, '../public');


// const Camera = require('./models/camera')

const Bags = require('./models/bagdetect')

mongoose.connect(
    'mongodb+srv://admin:admin123@cluster0-2fozs.mongodb.net/test?retryWrites=true&w=majority' , 
    { useNewUrlParser: true })
    .then(() => console.log('Database Connected')
    .catch(() => {
        console.log('err')
    })
);

mongoose.Promise = global.Promise;


const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var {getLocationFromCameraId} = require('./utils');



app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', publicPath);
// app.use(express.static(publicPath));

app.use(express.static(path.join(__dirname, '../static')));

// app.set('view engine', 'hbs');
// app.set('views',path.join(__dirname, '../public'));
// //static files
// app.use(express.static(path.join(__dirname, '../static')));


app.use(bodyParser.json());

app.io = io;

io.on('connection', (socket) => {
	console.log('New user detected');

	socket.on('disconnect', () => {
		console.log('User left');
	});
});

app.post('/api/detect/', (req, res) => {

    console.log(req.body)
    
    // let newb = JSON.parse(req.body)
    // console.log(newb)

    let camera_id = req.body.camera_id
    let time = req.body.time
    let screenshot_url = req.body.screenshot_url
    let number_of_bags = req.body.number_of_bags
    // let location = getLocationFromCameraId(camera_id)
    let location = req.body.location
    
    let cam_obj_id = ''

    // Camera.findOne({camera_id : camera_id}).then((res) => {
    //     cam_obj_id = res._id
    //     location.latitude = res.latitude
    //     location.longitude = res.longitude
    // }).catch((err) => {
    //     console.log(err)
    // }).then(() => {

        const newDetect = new Bags({
            camera_id : camera_id,
            time : time,
            screenshot_url : screenshot_url,
            number_of_bags : number_of_bags,
            location : location
        })

        newDetect.save().then((result) => {
            // console.log('etestinf')
            // console.log(result)
        }).catch((err) => {
            console.log(err)
        })

        req.app.io.emit('bagdetect', {
                camera_id,
                location,
                number_of_bags,
                time,
                screenshot_url,
        });

        res.status(200).send();    
    // })
    
});

// app.post('/api/camera/', (req, res) => {
//     const newCamera = new Camera({
//         camera_id : req.body.camera_id,
//         latitude: req.body.latitude,
//         longitude: req.body.longitude
//     })

//     newCamera.save().then((result) => {
//         res.status(200).json(result)
//     }).catch((err) => {
//         console.log(err)
//     })
// })

// app.get('/api/camera/', (req, res) => {
//     Camera.find(req.query).then((result) => {
//         if(result.length === 0){
//             res.json({message : 'query does not match any Event'})
//          }
//          else {
//             res.status(200).json(result)
//          }
//     }).catch((err) => {
//         console.log(err)
//     })
// })


app.get('/api/bags_list/', (req, res) => {

    Bags.find(req.query).then((result) => {
        if(result.length === 0){
           res.json({message : 'query does not match any Event'})
        }
        else {
           res.status(200).json(result)
        }
     }).catch((err) => {console.log(err)})
})

app.get('/', (req, res) => {

    Bags.find(req.query).then((result) => {
        if(result.length === 0){
           res.render('index', {"message" : 'query does not match any Event'})
        }
        else {
            console.log('asfjkhkajfhsjkha')
            // console.log(result)
            result.forEach((bag) => {
                bag.time = moment(bag.time).format('MMMM Do YYYY, h:mm:ss a')
            })

            // console.log(result.camera_id)
            
            res.render('index', {"res" : result})
        }
     }).catch((err) => {console.log(err)})


    
})


server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
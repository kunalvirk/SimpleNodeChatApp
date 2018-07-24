const express =  require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const dbUrl = 'mongodb://<dbuser>:<dbpass>@ds137687.mlab.com:37687/chatapp_db';

const Message = mongoose.model('Message', {
    name : String,
    message : String
});


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req,res) => {
    let message = new Message(req.body);
    message.save((err) => {
        if (err) sendStatus(500)

        io.emit('message', req.body);
        res.sendStatus(200);

    })
})

io.on('connection', (socket) => {
    console.log('user connected');
})
mongoose.connect(dbUrl, { useNewUrlParser: true } ,(err) => {
    console.log('mongo connection', err);
})
const server = http.listen(3000, () => console.log('server is listening on', server.address().port));
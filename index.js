const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {origins: '*:*', secure: true});
const cors = require('cors');

const PORT = 1337;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})

app.get('/', (req, res) => {
    res.send('Pedalboard!')
});

io.on('connection', socket => {
    console.log(`A user connected (${socket.id})`);

    socket.on('add effect', effect => {
        console.log(`Effect added ${effect.effect} by ${effect.name} (${socket.id})`);

        socket.broadcast.emit('add effect', {
            effect: effect.effect,
            id: socket.id,
            name: effect.name,
        });
    });

    socket.on('remove effect', effect => {
        console.log(`Effect removed ${effect.name} (${socket.id})`);

        socket.broadcast.emit('remove effect', {
            name: effect.name,
            id: socket.id,
        });
    });

    socket.on('update param', param => {
        console.log(`Effect prameter updated ${param.param} to ${param.value} by ${param.name} (${socket.id})`);

        socket.broadcast.emit('update param', {
            param: param.param,
            value: param.value,
            name: param.name,
            id: socket.id,
        });
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected (${socket.id})`);

        socket.broadcast.emit('remove effect', {
            id: socket.id,
        });
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

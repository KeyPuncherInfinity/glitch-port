const express = require('express')
const app = express()
const http = require('http').createServer(app)
const socket = require('socket.io')(http)

const localstorage = {}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/index.html')
})

app.use(express.static(__dirname + '/front'))

socket.on('connection', (client) => {
    
    client.on('name', (data) => {
        localstorage[data.namedata] = {
            id: client.id
        }
    })
    
    client.on('offer', (data) => {
        client.to(localstorage[data.target].id).emit('offer', data)
        localstorage[data.target].partner = client.id
    })
    
    client.on('answer', (data) => {
        client.to(localstorage[data.origin].partner).emit('answer', data)
    })

    client.on('ice-candidate', (data) => {
        client.to(localstorage[data.target].id).emit('ice-candidate', data)
    })


})


http.listen(80, () => {
    console.log('Server Active')
})


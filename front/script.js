const configuration = {
    'iceServers' : [
        {
            'urls' : 'stun:stun.l.google.com:19302'
        },
        {
            'urls' : 'turn:numb.viagenie.ca:3478',
            username : 'infini7y.beyond@gmail.com',
            credential : 'abdul'
        }
    ]
}



document.querySelector('button#start-record').addEventListener('click', () => {
    beginRecording()
})

document.querySelector('button#start-stream').addEventListener('click', () => {
    startStream()
})

const sock = io()

const peerConnection = new RTCPeerConnection(configuration)
window.connect = peerConnection

peerConnection.addEventListener('connectionstatechange', (event) => {
    if (peerConnection.connectionState === 'connected') {
        console.log('Connection Successful')
        console.log(event)
    } else {
        console.log('Connection Failed')
        console.log(event)
    }
});


sock.on('ice-candidate', async (data) => {
    await peerConnection.addIceCandidate(data.icecandidate)
    //console.log(data)
})

sock.on('offer', async (data) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offerdata))

    window.recordingmedia.getTracks().forEach(track => {
        window.connect.addTrack(track, window.recordingmedia)
    })

    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    sock.emit('answer', {
        answerdata: answer,
        origin: document.querySelector('input#origin').value
    })
    //console.log(data)
})

sock.on('answer', async (data) => {
    const remoteDesc = new RTCSessionDescription(data.answerdata)
    await peerConnection.setRemoteDescription(remoteDesc)
    //console.log(data)
})

peerConnection.onicecandidate = (e) => {
    if (e.candidate) {

        sock.emit('ice-candidate', {
            icecandidate: e.candidate,
            target: document.querySelector('input#target').value
        })
    }
}

peerConnection.ontrack = async (e) => {
    const remoteStream = new MediaStream()
    remoteStream.addTrack(e.track, remoteStream)
    document.querySelector('audio#audio-player').srcObject = remoteStream
}
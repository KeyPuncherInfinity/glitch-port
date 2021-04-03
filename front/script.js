const configuration = {
    'iceServers' : [
        {
            'urls' : 'stun:stun.l.google.com:19302'
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

peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        console.log(event)
    }
});

sock.on('ice-candidate', async (data) => {
    await peerConnection.addIceCandidate(data.icecandidate)
    console.log(data)
})

sock.on('offer', async (data) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offerdata))
    const answer = await peerConnection.createAnswer()
    peerConnection.setLocalDescription(answer)
    sock.emit('answer', {
        answerdata: answer,
        origin: document.querySelector('input#origin').value
    })
    console.log(data)
})

sock.on('answer', async (data) => {
    const remoteDesc = new RTCSessionDescription(data.answerdata)
    await peerConnection.setRemoteDescription(remoteDesc)
    console.log(data)
})

peerConnection.onicecandidate = (e) => {
    if (e.candidate) {

        sock.emit('ice-candidate', {
            icecandidate: e.candidate,
            target: document.querySelector('input#target').value
        })
    }
}
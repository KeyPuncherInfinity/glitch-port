


async function startStream () {

    window.recordingmedia.getTracks().forEach(track => {
        window.connect.addTrack(track, window.recordingmedia)
    })
    
    const datachannel = window.connect.createDataChannel('channel')
    window.dc = datachannel

    datachannel.onopen = () => {
        console.log('Channel Ready')
    }

    datachannel.onmessage = (mess) => {
        console.log(mess)
    }

    datachannel.send('hello')

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer)
    sock.emit('offer', {
        offerdata: offer,
        target: document.querySelector('input#target').value
    })

    
}

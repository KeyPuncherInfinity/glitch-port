


async function startStream () {

    window.recordingmedia.getTracks().forEach(track => {
        window.connect.addTrack(track, window.recordingmedia)
    })

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer)
    sock.emit('offer', {
        offerdata: offer,
        target: document.querySelector('input#target').value
    })

    
}

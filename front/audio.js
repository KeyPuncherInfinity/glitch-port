
const constraints = {
    'audio': true,
    'video': false
}

async function beginRecording () {
    const recordingmedia = await openMediaDevice (constraints)
    // document.querySelector('audio#audio-player').srcObject = recordingmedia

    window.recordingmedia = recordingmedia
    sock.emit('name', {
        namedata: document.querySelector('input#origin').value
    })
}


async function openMediaDevice (cons) {
    const mic = await navigator.mediaDevices.getUserMedia(cons)
    console.log(mic)
    return mic
}
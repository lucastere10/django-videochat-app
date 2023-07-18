const APP_ID = 'ac27f8cc4799439cafdd8d5fbe058802'
const CHANNEL = 'main'
const TOKEN = '007eJxTYHD4teMs62cfCec+paYc35532fG3PitNu7zis6OixIfm9H8KDInJRuZpFsnJJuaWlibGlsmJaSkpFimmaUmpBqYWFgZGr4OWpDQEMjI4fBVmZGSAQBCfhSE3MTOPgQEAxgIhJw=='
let UID;

console.log("streams.js connected")

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async() => {
    client.on('user-publish', handleUserJoined)
    client.on('user-left', handleUserLeft)


    UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    let player = `        
        <div class="video-container" id="user-container-1">
            <div class="username-wrapper"><span class="user-name">User Name</span></div>
            <div class="video-player" id="user-${UID}"></div>
        </div>
    `
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }

        player = `        
        <div class="video-container" id="user-container-1">
            <div class="username-wrapper"><span class="user-name">User Name</span></div>
            <div class="video-player" id="user-${UID}"></div>
        </div>
    `
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType == 'audio'){
        user.audioTrack.play()
    }

}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove
}

let leaveAndRemoveLocalStream = async () => {
    for (let i=0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    //This is somewhat of an issue because if user leaves without actaull pressing leave button, it will not trigger
    deleteMember()
    window.open('/', '_self')
}

let toggleCamera = async (e) => {
    console.log('TOGGLE CAMERA TRIGGERED')
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let toggleMic = async (e) => {
    console.log('TOGGLE MIC TRIGGERED')
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

joinAndDisplayLocalStream()

document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
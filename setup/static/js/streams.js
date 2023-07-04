const APP_ID = 'ac27f8cc4799439cafdd8d5fbe058802'
const CHANNEL = 'main'
const TOKEN = '007eJxTYHD4teMs62cfCec+paYc35532fG3PitNu7zis6OixIfm9H8KDInJRuZpFsnJJuaWlibGlsmJaSkpFimmaUmpBqYWFgZGr4OWpDQEMjI4fBVmZGSAQBCfhSE3MTOPgQEAxgIhJw=='
let UID;

console.log("streams.js connected")

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async() => {
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
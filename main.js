const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')
const currentProgress = document.getElementById('current-progress')


//indis
let index

//tekrar döngü
let loop

const songsList=[
    {
        name: "Champions League Music",
        link: "assets/cl-music.mp3",
        artist: "Tony Britten",
        image: "assets/cl.webp"
    },
    {
        name: "Askin Olayim",
        link: "assets/askin-olayim.mp3",
        artist: "Simge Sagin",
        image: "assets/icardi.webp"
    },
    {
        name: "Adanmis Hayatlarin Umudu",
        link: "assets/adanmis-hayatlarin-umudu.mp3",
        artist: "Gs Tribun Korosu",
        image: "assets/adanmis-hayatlar.jpg"
    },
    {
        name: "İnandik Biz Sizlere",
        link: "assets/inandik-biz-sizlere.mp3",
        artist: "GS Tribun Korosu",
        image: "assets/tribun.jpeg"
    },
    {
        name: "Sereftir Seni Sevmek",
        link: "assets/sereftir-seni-sevmek.mp3",
        artist: "GS Tribun Korosu",
        image: "assets/tribun2.jpg"
    }
]

// olaylar objesi
let events = {
    mouse:{
        click: "click"
    },
    touch:{
        click: "touchstart"
    }
}

let deviceType = ""

const isTouchDevice = ()=>{
    try {
        document.createEvent('TouchEvent')
        deviceType = "touch"
        return true
    } catch(error) {
        deviceType="mouse"
        return false
    }
}

// zaman formatlama
const timeFormatter = (timeInput)=>{
    let minute = Math.floor(timeInput/60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}

//set song
const setSong=(arrayIndex)=>{
    //tum ozellikler
    console.log(arrayIndex)
    let {name,link,artist,image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    //sureyi gosterme
    audio.onloadedmetadata = ()=>{
        maxDuration.innerText = timeFormatter(audio.duration)
    }
    playListContainer.classList.add("hide")
    playAudio()
}

//sarkıyı oynatma
const playAudio = ()=>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}

//sarkıyı tekrar calma
repeatButton.addEventListener('click',()=>{
    if(repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
    }else{
        repeatButton.classList.add('active')
        audio.loop = true
    }
})

//sonraki sarkıya gecme
const nextSong = () =>{
    //dongü acık çalıyorsa
    if(loop){
        if(index==(songsList.length - 1)){
            //başa sar
            index = 0
        }else {
            index+=1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() + songsList.length)
        setSong(randIndex)
        
    }

    playAudio()
}

// sarkıyı durdur
const pauseAudio = () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//onceki sarki
const previousSong = () =>{
    if(index>0){
        pauseAudio()
        index-=1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
    playAudio()
}

// siradakine geç
audio.onended = () =>{
    nextSong()
}

// shuffle songs
shuffleButton.addEventListener('click',()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop = true
    } else {
        shuffleButton.classList.add('active')
        loop = false
    }
})


//play button
playButton.addEventListener('click',playAudio)

//next button
nextButton.addEventListener('click',nextSong)

//pause button
pauseButton.addEventListener('click',pauseAudio)

//prev button
prevButton.addEventListener('click',previousSong)

isTouchDevice()
progressBar.addEventListener(events[deviceType].click, (event)=>{
    //progress bar baslat
    let coordStart = progressBar.getBoundingClientRect().left

    //fare ile dokunma
    let coorEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX
    let progress = (coorEnd - coordStart) / progressBar.offsetWidth

    //genisligi koyma 
    currentProgress.style.width = progress * 100 + "%"

    //zamanı ata
    audio.currentTime = progress * audio.duration

    //oynat
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

// zaman aktıkça current progress ılerleme
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime/audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

// zaman güncellemesi
audio.addEventListener('timeupdate',()=>{
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})
 
window.onload = ()=>{
    index = 0
    setSong(index)
    initPlayList()
}

const initPlayList = ()=>{
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-album">
                ${songsList[i].artist}
            </span>
        </div>
        </li>
        `
    }
}

//sarkı listesini gösterme
playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})

//sarkı listesini göster
closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})
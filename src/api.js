import axios from 'axios'

const HOST_NAME = 'http://localhost:8080'

function findMusic(kw, limit) {
    let url = HOST_NAME + '/search?kw=' + kw
    if (limit != -1)
        url += '&limit=' + limit
    return axios.get(url)
}

function artistDetail(id) {
    let url = HOST_NAME + '/artist/' + id
    return axios.get(url)
}

function albumDetail(id) {
    let url = HOST_NAME + '/album/' + id
    return axios.get(url)
}

function getSongs(id, type) {
    let url = HOST_NAME + '/songs/' + id + "?type=" + type
    return axios.get(url)
}

function getSheets(uid) {
    let url = HOST_NAME + '/sheets/' + uid
    return axios.get(url)
}

function getSheet(sid) {
    let url = HOST_NAME + '/sheet/' + sid
    return axios.get(url)
}

function updateSheet(data) {
    let url = HOST_NAME + '/updateSheet'
    return axios.post(url, data)
}

function getAlbumsbyArtist(aid) {
    let url = HOST_NAME + '/albums/' + aid
    return axios.get(url)
}

function register(user) {
    let url = HOST_NAME + '/register'
    return axios.post(url, user)
}

function login(user) {
    let url = HOST_NAME + '/login'
    return axios.post(url, user)
}

function deleteSheet(sid) {
    let url = HOST_NAME + '/deleteSheet/' + sid
    return axios.get(url)
}

function addSheet(data) {
    let url = HOST_NAME + '/addSheet'
    return axios.post(url, data)
}

function addSongToSheet(data) {
    let url = HOST_NAME + '/song/addsheet'
    return axios.post(url, data)
}

function deleteSongFromSheet(data) {
    let url = HOST_NAME + '/song/delsheet'
    return axios.post(url, data)
}

function findLyric(id) {
    let url = HOST_NAME + '/lyric/' + id
    return axios.get(url)
}

function collect(data) {
    let url = HOST_NAME + '/collect'
    return axios.post(url, data)
}

function uncollect(data) {
    let url = HOST_NAME + '/uncollect'
    return axios.post(url, data)
}

function checkCollected(data) {
    let url = HOST_NAME + '/checkCollected'
    return axios.get(url, { params: data })
}

function checkHavedSheet(data) {
    let url = HOST_NAME + '/checkHavedSheet'
    return axios.get(url, { params: data })
}

function checkSong(data) {
    let url = HOST_NAME + '/checkSong'
    return axios.get(url, { params: data })
}

function findCollections(uid, tid) {
    let url = HOST_NAME
    switch(tid) {
        case 1: url += '/album/collections' 
            break   
        case 2: url += '/sheet/collections' 
            break
        case 3: url += '/artist/collections' 
            break
    }
    
    return axios.get(url, { params: {uid: uid}})
}

function getUserInfo(uid) {
    let url = HOST_NAME + '/userInfo'
    return axios.get(url, { params: {uid: uid}})
}

function getRank(t) {
    let url = HOST_NAME
    switch (t) {
        case 1: url += '/sheet/rank'
            break
        case 2: url += '/album/rank'
            break       
    }
    return axios.get(url)
}

function playSong(t, data) {
    let url = HOST_NAME
    switch (t) {
        case 1: url += '/sheet/play'
            break
        case 2: url += '/album/play'
            break       
    }
    return axios.post(url, data)
}

/* 统一处理API错误 */
function onError(err) {
    console.log(err);
    this.$notify({ type: 'danger', message: '系统出错' });
}

/* 统一处理逻辑错误 */


export default {
    findMusic,
    artistDetail,
    albumDetail,
    getSongs,
    getSheets,
    getSheet,
    getAlbumsbyArtist,
    register,
    updateSheet,
    deleteSheet,
    onError,
    login,
    addSheet,
    addSongToSheet,
    deleteSongFromSheet,
    findLyric,
    collect,
    uncollect,
    checkCollected,
    checkHavedSheet,
    checkSong,
    findCollections,
    getUserInfo,
    getRank,
    playSong,
}
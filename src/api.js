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
}
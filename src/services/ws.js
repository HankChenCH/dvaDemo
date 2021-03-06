import { Base64 } from 'js-base64'
import { config, deleteProps } from '../utils/'

const { prefix, websocketURL } = config

let websocket = undefined
let readyTimer
const eventListener = []

function getWebsocket(url, from = null) {
    if (from !== null && from !== '/login') {
    
        if (!(websocket instanceof WebSocket)) {
            const token = JSON.parse(localStorage.getItem(`${prefix}admin`)).token
            const ip = JSON.parse(Base64.decode(token.split('.')[1])).user.ip
            websocket = new WebSocket(url + '?token=' + token + '&ip=' + ip)
        } else if (websocket instanceof WebSocket && websocket.readyState !== 1) {
            const token = JSON.parse(localStorage.getItem(`${prefix}admin`)).token
            websocket = new WebSocket(url + '?token=' + token)
        }

    }
    return websocket
}

export async function connect(from) {
    const client = getWebsocket(websocketURL, from)
        client.onopen = () => {
        }
        client.onmessage = (res) => {
            const message = JSON.parse(res.data)
            const { event } = message
            // console.log(message, event)
            if (eventListener[event] instanceof Function && deleteProps(message, ['event'])) {
                eventListener[event](message)
            }
        }
}

//增加监听服务器事件以及返回结果
export function on(event, cb) {
    // console.log(eventListener)
    if(eventListener[event] instanceof Function) {
        console.error('this event already has listener function,please checkout!')
        return
    }

    eventListener[event] = cb
}

//普通发送消息
export async function sendMsg(data = {}) {
    ready(() => {
        const client = getWebsocket(websocketURL)
        const sendBody = { ...data, event: 'manager/chat/message'}
        client.send(JSON.stringify(sendBody))
    })
}

//触发服务器事件
export async function trigger(event, data = {}) {
    ready(() => {
        const client = getWebsocket(websocketURL)
        const sendBody = { ...data, event: event }
        client.send(JSON.stringify(sendBody))
    })
}

//客户端主动关闭
export async function close(code, reason) {
    let client = getWebsocket(websocketURL)
    if (client instanceof WebSocket) {
        client.close(code, reason)
        client = null
        websocket = null
    }
}

//检查客户端是否准备好
export async function ready(cb) {
    if (!(cb instanceof Function)) {
        console.error('param 1 must be a callback function!')
        return false
    }
    const client = getWebsocket(websocketURL)
    if (client instanceof WebSocket && client.readyState === 1) {
        clearTimeout(readyTimer)
        cb()
    } else if (client instanceof WebSocket && client.readyState === 3) {
        clearTimeout(readyTimer)
    } else {
        readyTimer = setTimeout(() => ready(cb),500)
    }
}
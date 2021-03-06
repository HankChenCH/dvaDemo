import config from './config'
import env from './env'
import menu from './menu'
import request from './request'
import * as Enum from './enum'
import * as Validate from './validates'
import classnames from 'classnames'
import { color } from './theme'
import lodash from 'lodash'
import { Base64 } from 'js-base64'
import particlesConfig from './particlesCofig'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 删除对象下的多组属性
 * @param   {obj}     obj
 * @param   {array}   props
 * @return  {bool}
 */
const deleteProps = (obj, props = []) => {
  for(let i = 0; i < props.length; i++){
    if(!Reflect.deleteProperty(obj, props[i])){
      return false
    }
  }

  return true
}

/**
 * 检查对象是否存在属性
 * @param   {obj}     obj
 * @param   {string}  prop
 * @return  {bool}
 */
const hasProp = (obj, prop) => {
  return Reflect.has(obj, prop)
}

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    },ms)
  })
}

const queryObjToString = (queryObj) => {
  if (!(queryObj instanceof Object)) {
    return ''
  }

  let queryArr = []

  for(let i in queryObj) {
    if (hasProp(queryObj, i))queryArr.push(`${i}=${queryObj[i]}`)
  }

  return queryArr.join('&')
}

const getAuth = (permission, userAuth) => {
  if(userAuth.indexOf(permission) !== -1) {
    return true
  }

  return false
}

const getDropdownMenuOptions = (menuOptions, userAuth) => {
  return menuOptions.filter( item => getAuth(item.auth, userAuth) || !hasProp(item, 'auth'))
}

module.exports = {
  config,
  particlesConfig,
  menu,
  env,
  request,
  Enum,
  Validate,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  deleteProps,
  hasProp,
  sleep,
  queryObjToString,
  getAuth,
  getDropdownMenuOptions
}

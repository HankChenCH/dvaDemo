import modelExtend from 'dva-model-extend'
import * as productService from '../services/product'
import { pageModel } from './common'
import { config, deleteProps } from '../utils'

const { query, create, update, queryDetail, updateDetail, updateParams, updateStockAndPrice, pullOnOff, batchOnOff, batchRemove, remove } = productService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'product',

  state: {
    currentItem: {},
    uploadTempItem: {},
    modalVisible: false,
    currentStep: 0,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/product') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const res = yield call(query, payload)
      if (res.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: res.data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total,
            }
          },
        })
      } else {
        throw res
      }
    },

    *reloadList({ payload = {} }, { call, select }) {
      const { pagination } = yield select(_ => _.product)
      yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
    },

    *'delete' ({ payload }, { call, put, select }) {
      const res = yield call(remove, { id: payload })
      const { selectedRowKeys, pagination } = yield select(_ => _.product)
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'app/messageSuccess', payload:"删除商品成功" })
        yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *'multiDelete' ({ payload }, { call, put, select }) {
      const { pagination } = yield select(_ => _.product)
      const res = yield call(batchRemove, { ids: payload.ids.join(',') })
      if (res.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload:"删除商品成功" })
        yield put({ type: 'query', payload: { page: pagination.current, pageSize: pagination.pageSize } })
      } else {
        throw res
      }
    },

    *create ({ payload }, { call, put, select }) {
      const { currentStep } = yield select(({ product }) => product)
      const newProduct = Object.assign(payload, { ...payload.img })
      if (!deleteProps(newProduct, ['img'])) {
        yield put({ type: 'app/messageError', payload: "创建商品失败" })
      }

      const res = yield call(create, { ...newProduct, is_on: '0' })
      if (res.success) {
        yield put({ type: 'updateState', payload: { 
            currentStep: currentStep + 1, 
            modalType: 'update',
            currentItem: { ...res.data, details: {detail: ''}, properties: []}
          } 
        })
        yield put({ type: 'app/messageSuccess', payload:"创建商品成功" })
      } else {
        throw res
      }
    },

    *update ({ payload }, { select, call, put }) {
      const { currentStep, currentItem } = yield select(({ product }) => product)
      const newProduct = Object.assign(payload, { ...payload.img, id: currentItem.id })
      if (!deleteProps(newProduct, ['img'])) {
        yield put({ type: 'app/messageError', payload: "更新商品基础信息失败" })
      }

      const res = yield call(update, newProduct)
      if (res.success) {
        yield put({ type: 'updateState', payload: { 
            currentStep: currentStep + 1,
            currentItem: { ...currentItem, ...res.data}
          } 
        })
        yield put({ type: 'app/messageSuccess', payload:"更新商品基础信息成功" })
      } else {
        throw res
      }
    },

    *updateDetail ({ payload }, { put, call, select }) {
      const { currentStep, currentItem } = yield select(({ product }) => product)
      const newProduct = { ...payload, id: currentItem.id }
      const res = yield call(updateDetail, newProduct)
      if (res.success) {
        currentItem.details = res.data
        yield put({ type: 'updateState', payload: { 
            currentStep: currentStep + 1,
            currentItem: currentItem, 
          } 
        })
        yield put({ type: 'app/messageSuccess', payload:"保存商品详情信息成功" })
      } else {
        throw res
      }
    },

    *updateParams ({ payload }, { put, call, select }) {
      const { currentItem } = yield select(({ product }) => product)
      const newProduct = { properties: payload, id: currentItem.id }
      const res = yield call(updateParams, newProduct)
      if (res.success) {
        currentItem.properties = res.data
        yield put({ type: 'updateState', payload: { 
            currentItem: currentItem, 
          } 
        })
        yield put({ type: 'app/messageSuccess', payload:"保存商品规格信息成功" })
        yield put({ type: 'hideModal' })
      } else {
        throw res
      }
    },

    *pullItem ({ payload }, { put, call, select }) {
      const res = yield call(pullOnOff, { id: payload.id, is_on: payload.is_on ? '1' : '0' })
      if (res.success) {
        let list = yield select(({ product }) => product.list)
        let newList = list.map((item) => item.id === payload.id ? {...item, is_on: payload.is_on ? '1' : '0'} : item)
        yield put({ type: 'updateState', payload: {list: newList} })
        yield put({ type: 'app/messageSuccess', payload: (payload.is_on ? '上架' : '下架') + '成功' })
      } else {
        throw res
      }
      
    },

    *multiOnOff ({ payload }, { put, call, select }) {
      const { list, selectedRowKeys } = yield select(({ product }) => product)
      const res = yield call(batchOnOff, { ids: payload.ids.join(','), is_on: payload.is_on })
      if (res.success) {
        let newList = list.map(item => { 
          if(selectedRowKeys.indexOf(item.id) !== -1){
            return { ...item, is_on: res.data.is_on }
          }

          return item
        })
        yield put({ type: 'updateState', payload: { list: newList, selectedRowKeys: [] } })
        yield put({ type: 'app/messageSuccess', payload: '批量' + (res.data.is_on === '1' ? '上' : '下') + '架成功' })
      } else {
        yield put({ type: 'query' })
        throw res
      }
    },

    *updateCurrentItem ({ payload }, { put, call }){
      const currentItem = yield select(({ product }) => product.currentItem)
      const res = yield call(updateStockAndPrice, { ...currentItem });
      if (res.success) {
        yield put({ type: 'updateState', payload: {currentItem: {}} })
        yield put({ type: 'app/messageSuccess', payload:"更新商品成功" })
      } else {
        yield put({ type: 'query' })
        throw res
      }
    },

    *showEditModal ({ payload }, { put, call }) {
      const res = yield call(queryDetail, { id: payload.currentItem.id })
      if (res.success) {
        yield put({ type: 'showModal', payload: { ...payload, currentItem: res.data } })
      } else {
        throw res
      }
    },

    *changeDetail ({ payload }, { put, call, select }){
      const currentItem = yield select(({ product }) => product.currentItem)
      yield put({ 
        type: 'updateState', 
        payload: { 
          currentItem: { 
            ...currentItem, 
            detail: payload 
          } 
        } 
      })
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, currentItem:{}, modalVisible: false }
    }, 
  },
})

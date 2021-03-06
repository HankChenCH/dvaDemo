import { request, config } from '../utils'
const { api } = config
const { list, info, price, delivery, issue, batch, close, ticket } = api.order

export async function query (params) {
  return request({
    url: list,
    method: 'get',
    data: params,
  })
}

export async function queryDetail (params) {
	return request({
		url: info,
		method: 'get',
		data: params
	})
}

export async function queryTickets (params) {
	return request({
		url: ticket,
		method: 'get',
		data: params,
	})
}

export async function update (params) {
	return request({
		url: info,
		method: 'put',
		data: params,
	})
}

export async function changePrice (params) {
	return request({
		url: price,
		method: 'put',
		data: params,
	})
}

export async function deliveryGoods (params) {
	return request({
		url: delivery,
		method: 'put',
		data: params,
	})
}

export async function issueGoods (params) {
	return request({
		url: issue,
		method: 'put',
		data: params,
	})
}

export async function remove (params) {
	return request({
		url: info,
		method: 'delete',
		data: params,
	})
}

export async function batchRemove (params) {
	return request({
		url: batch,
		method: 'delete',
		data: params,
	})
}

export async function batchClose (params) {
	return request({
		url: close,
		method: 'put',
		data: params,
	})
}

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Switch, InputNumber, Row, Col } from 'antd'
import styles from './BuyNowTable.less'
import classnames from 'classnames'
import { DropOption } from '../../../components'
import { Link } from 'dva/router'

const confirm = Modal.confirm
const info = Modal.info

const BuyNowTable = ({ item, onDeleteItem, onShowTicketList, ...tableProps }) => {

  const handleMenuClick = (record, e) => {
    if (e.key === '3') {
      onDeleteItem(record.id)
    } else if (e.key === '2') {
      onShowTicketList(record.id)
    } else if (e.key === '1') {
      info({
        title: '生成页面路径',
        content: (
          <div>
            {`pages/buy-now/buy-now?id=${item.id}&bid=${record.id}`}
          </div>
        )
      })
    }
  }

  const menuOptions = [{ 
      key: '1',
      name: '页面路径' 
    }, { 
      key: '2',
      name: '出票列表'
    }, { 
      key: '3',
      name: '删除'
  }]

  const columns = document.body.clientWidth < 769 ? 
  [
    {
      title: '秒杀信息',
      dataIndex: 'batch_info',
      key: 'batch_info',
      render: (text, record) => <section>
        <Row gutter={8}>
          <Col span={24}>
            <label>秒杀批次：</label>
            <span>{record.batch_no}</span>
          </Col>
          <Col span={24}>
            <label>开始时间：</label>
            <span>{new Date().setTime(parseInt(record.start_time) * 1000)}</span>
          </Col>
          <Col span={24}>
            <label>结束时间：</label>
            <span>{new Date().setTime(parseInt(record.end_time) * 1000)}</span>
          </Col>
          <Col span={24}>
            <label>单价：</label>
            <span>{record.price}</span>
          </Col>
          <Col span={24}>
            <label>库存量：</label>
            <span>{record.stock}</span>
          </Col>
          <Col span={24}>
            <label>限购数：</label>
            <span>{record.limit_every}</span>
          </Col>
        </Row>
      </section>
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
      },
    }
  ] :  
  [
    {
      title: '秒杀批次',
      dataIndex: 'batch_no',
      key: 'batch_no',
    }, {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (text) => {
        let newDate = new Date()
        newDate.setTime(text * 1000)
        return <div>{newDate.format('yyyy-MM-dd HH:mm')}</div>
      }
    }, {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (text) => {
        let newDate = new Date()
        newDate.setTime(text * 1000)
        return <div>{newDate.format('yyyy-MM-dd HH:mm')}</div>
      }
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '库存量',
      dataIndex: 'stock',
      key: 'stock',
    }, {
      title: '限购数',
      dataIndex: 'limit_every',
      key: 'limit_every'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
      },
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

BuyNowTable.propTypes = {
  onDeleteItem: PropTypes.func,
}

export default BuyNowTable
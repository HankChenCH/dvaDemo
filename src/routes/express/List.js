import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { AuthDropOption } from '../../components/Auth'
import { env, getDropdownMenuOptions } from '../../utils'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ userAuth, onManagerItem, onDeleteItem, onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if(e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定要删除快递公司 ' + record.express_name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const menuOptions = getDropdownMenuOptions([{ key: '1', name: '更新', auth: env.expressUpdate }, { key: '2', name: '删除', auth: env.expressRemove }], userAuth)

  const columns = [
    {
      title: '快递公司名',
      dataIndex: 'express_name',
      key: 'express_name',
    }, {
      title: '快递价格',
      dataIndex: 'express_price',
      key: 'express_price',
    }, {
      title: '快递包邮起价',
      dataIndex: 'express_limit',
      key: 'express_limit',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <AuthDropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={menuOptions} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List

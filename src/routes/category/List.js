import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './List.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { AuthButton, AuthDropOption } from '../../components/Auth'
import { env, getDropdownMenuOptions } from '../../utils'

const confirm = Modal.confirm

const List = ({ userAuth, onManagerItem, onDeleteItem, onEditItem, location, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onManagerItem(record)
    } else if(e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定要删除分类 ' + record.name + ' ?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const menuOptions = getDropdownMenuOptions([{ key: '1', name: '商品管理', auth: env.categoryManagerProduct }, { key: '2', name: '更新', auth: env.categoryUpdate }, { key: '3', name: '删除', auth: env.categoryRemove }], userAuth)

  const columns = [
    {
      title: '分类名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '头图',
      dataIndex: 'img.url',
      key: 'topic_img',
      render: (text, record) => {
        return <img style={{maxWidth: '130px'}} src={text}/>
      }
    }, {
      title: '分类描述',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => {
        return text == null ? '-' : text;
      }
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

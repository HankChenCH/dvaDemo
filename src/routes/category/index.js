import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { env } from '../../utils'
import { AuthButton } from '../../components/Auth'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import ManagerModal from '../components/ManagerModal/'

const Category = ({ location, dispatch, app, category, loading }) => {
  const { productAll, userAuth } = app
  const { list, pagination, currentItem, modalVisible, managerModalVisible, currentProductKeyList, modalType, selectedRowKeys, uploadTempItem } = category
  const { pageSize } = pagination

  const modalProps = {
    item: Object.assign((modalType === 'create' ? {} : currentItem), uploadTempItem),
    modalType: modalType,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`category/${modalType}`],
    title: `${modalType === 'create' ? '创建分类' : '更新分类'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `category/${modalType}`,
        payload: data,
      })
    },
    onError (data) {
      dispatch({
        type: `app/messageError`,
        payload: data
      })
    },
    onUploadSuccess(data) {
      dispatch({
        type: 'category/uploadImageSuccess',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'category/hideModal',
      })
    },
  }

  const managerModalProps = {
    productAll,
    currentProductKeyList,
    visible: managerModalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['category/setProductList'],
    title: `${currentItem.name}--商品管理`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: 'category/setProductList',
        payload: data
      })
    },
    onCancel () {
      dispatch({
        type: 'category/hideManagerModal',
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['category/query'],
    pagination,
    location,
    userAuth,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onManagerItem (item) {
      dispatch({
        type: 'category/showProductManager',
        payload: {
          currentItem: item,
        }
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'category/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'category/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    userAuth,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/category',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/category',
      }))
    },
    onAdd () {
      dispatch({
        type: 'category/showModal',
        payload: {
          modalType: 'create',
        },
      })
    }
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'category/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      {
         selectedRowKeys.length > 0 &&
           <Row style={{ marginBottom: 18, textAlign: 'right', fontSize: 13 }}>
             <Col>
               {`选择了 ${selectedRowKeys.length} 条分类 `}
               <Popconfirm title={'确定要删除选中的分类?'} placement="bottomRight" onConfirm={handleDeleteItems}>
                 <AuthButton auth={env.categoryRemove} userAuth={userAuth} type="danger" size="small" style={{ marginLeft: 8 }}>批量删除</AuthButton>
               </Popconfirm>
             </Col>
           </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
      {managerModalVisible && <ManagerModal {...managerModalProps} />}
    </div>
  )
}

Category.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ app, category, loading }) => ({ app, category, loading }))(Category)

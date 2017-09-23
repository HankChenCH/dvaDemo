module.exports = {
  name: '探小店后台',
  prefix: 'tan_shop_',
  footerText: '探小店后台  © 2017 中山食探工作室',
  logo: '/st.jpg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: 'http://api.onegledog.cn/v1',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['https://www.onegledog.cn'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  api: {
    system: {
      alogin: '/token/admin',
      relogin: '/token/admin/relogin',
      alogout: '/token/admin',
    },
    dashboard: {
      home: '/home'
    },
    product: {
      all: '/product/all',
      list: '/product',
      info: '/product/:id',
      batch: '/product/batch',
      stockAndPrice: '/product/:id/stock_and_price',
      detail: '/product/:id/detail',
      properties: '/product/:id/properties',
      pull: 'product/:id/pullOnOff',
      recent: '/product/recent',
      countAllSales: '/product/sales',
    },
    category: {
      list: '/category/all',
      info: '/category/:id',
      batch: '/category/batch',
      products: '/product/by_category',
      setProducts: 'category/:id/product'
    },
    theme: {
      list: '/theme/all',
      info: '/theme/:id',
      batch: '/theme/batch',
      products: '/theme/:id/product',
      setProducts: 'theme/:id/product'
    },
    user:{
      list: '/user',
      info: '/user/:id',
    }, 
    admin: {
      list: '/admin',
      info: '/admin/:id',
      status: '/admin/:id/status',
      batch: '/admin/batch',
    },
    order:{
      list: '/order/by_admin',
      info: '/order/by_admin/:id',
      price: '/order/by_admin/price/:id',
      delivery: '/order/by_admin/delivery/:id',
      batch: '/order/by_admin/batch',
    },
    image: {
      themeTopic: 'image/theme_topic_img',
      themeHead: 'image/theme_head_img',
      categoryTopic: 'image/category_topic_img',
      productMain: 'image/product_main_img',
      productDetail: 'image/product_detail_img',
    },
  },
  imgStyle: {
    product: {
      thumb: '?imageView2/1/w/32/h/32/q/75|imageslim',
    }
  }
}

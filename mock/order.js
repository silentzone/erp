import Mock from 'mockjs'

const List = []
const count = 100

  
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    orderId: '@increment',
    ORDER_DATE: +Mock.Random.date('T'),
    GOODS_ID : '@increment',
    GOODS_NAME : '@title(5, 8)',  
    'orderType|1': ['进货', '出货'], 
    'customType|1': ['上游', '下游'],
    customId:'@increment',
    customName :  '@title(5, 8)', 
    orderNo :'@increment',
    goodsUnit : 'KG', 
    saleCount : 1200,
    salePrice : '@float(0, 100, 2, 2)',
    saleAmount : '@float(0, 100, 2, 2)',
    remark : '@title(15, 35)', 
    createTime : +Mock.Random.date('T'),
    createUser :'@first', 
    updateTime : +Mock.Random.date('T'),
    upUPDATE_USER :'@first', 
    CHECK_TIME :  +Mock.Random.date('T'),
    CHECK_USER :'@first',    
  }))
}

export default [
  {
    url: '/order/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/order/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },
 

  {
    url: '/order/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/order/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]


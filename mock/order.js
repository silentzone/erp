import Mock from 'mockjs'

const List = []
const count = 100

  
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    orderId: '@increment',
    orderDate: +Mock.Random.date('T'),
    goodsId: '@increment',
    goodsName : '@title(1,1)',  
    'orderType|1': ['回收加工', '卖出','买卖'], 
    // 'customType|1': ['上游', '下游'],
    customId:'@increment',
    customName :  '@title(1, 1)', 
    orderNo :'@increment',
    saleCountKg : '@float(0, 100, 2, 2)', // 销售数量(Kg)
    saleCountPail: '@float(0, 100, 2, 2)', // 数量 (桶) 
    salePrice : '@float(0, 100, 2, 2)',  // '销售单价(Kg)',
    saleAmount : '1900', // '销售总价', 
    buyCountKg : '2900',
    buyCountPail: '2900',
    buyPrice :'@float(0, 100, 2, 2)',  // '买入单价(Kg)',
    buyAmount: '@float(0, 100, 2, 2)',  // '买入单价(Kg)', 
    percentage : '99',
    buyCustomId : '@increment',
    buyCustomName :   '@title(1, 5)',  
    'checkFlag|1' : ['未审核', '已审核'], 
    remark : '@title(1, 5)', 
    createTime : +Mock.Random.date('T'),
    createUser :'@first', 
    updateTime : +Mock.Random.date('T'),
    updateUser :'@first', 
    checkTime :  +Mock.Random.date('T'),
    checkUser :'@first',  
    orderFee : [{ 
      'feeType|1' : ['加工费', '运营费','桶费','折损费'], 
      feeAmount: '@float(0, 100, 2, 2)',
      remark : '@title(1, 5)',
    }]  
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


import Mock from 'mockjs'

const List = []
const count = 100

  
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    customId: '@increment',
    updateTime: +Mock.Random.date('T'),
    createTime: +Mock.Random.date('T'),
    customName: '@first', 
    contactName: '@title(5, 10)', 
    contactNumber: "0711-1928384",
    remark: '@title(5, 10)',
    createUser: '@first', 
    updateUser:"admin",
    'customType|1': ['上游', '下游']
  }))
}

export default [
  {
    url: '/customs/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List
  
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
    url: '/customs/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/customs/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]


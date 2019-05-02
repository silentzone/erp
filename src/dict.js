module.exports = {
  orderType: [
    { label: '买入', value: 'BUY' },
    { label: '卖出', value: 'SELL' },
    { label: '买卖', value: 'BUG_SELL' },
    { label: '回收', value: 'RECYCLE' },
    { label: '加工', value: 'REDO' },
    { label: '回收加工', value: 'RECYCLE_REDO' },
    { label: '付款', value: 'PAY' },
    { label: '收款', value: 'RECEIPT' },
    { label: '实收库存', value: 'STORE_IN' },
    { label: '实收资金', value: 'MONEY_IN' },
    { label: '应付库存', value: 'STORE_PAY' },
    { label: '应付资金', value: 'MONEY_PAY' },
    { label: '折损库存', value: 'STORE_OUT' },
    { label: '折损资金', value: 'MONEY_OUT' }
  ],
  feeType: [
    { label: '加工费', value: '1' },
    { label: '运营费', value: '2' },
    { label: '桶费', value: '3' },
    { label: '折损费', value: '4' }
  ],
  saleType: [
    { label: '上游', value: '1' },
    { label: '下游', value: '2' }
  ],
  checkFlag: [
    { label: '未审核', value: '0' },
    { label: '已审核', value: '1' }
  ]

}

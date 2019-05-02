<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orderId" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="订单ID" prop="orderId" sortable="custom" align="center" width="100" />
      <el-table-column label="商品名称" prop="goodsName" width="120px" align="center" />
      <el-table-column label="客户名称" prop="customName" width="120px" align="center" />
      <el-table-column label="订单编号" prop="orderNo" width="150px" align="center" />
      <el-table-column label="销售金额" prop="salePrice" width="100px" align="center" />
      <el-table-column label="销售总额" prop="saleAmount" width="100px" align="center" />
      <el-table-column label="更新时间" prop="updateTime" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUser" width="110px" align="center" />
      <el-table-column label="修改人" prop="updateUser" width="110px" align="center" />
      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="订单管理" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" size="mini" :inline="true">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="日期">
              <el-date-picker v-model="temp.orderDate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编号" prop="orderNo">
              <el-input v-model="temp.orderNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" prop="orderType">
              <el-select v-model="temp.orderType" class="filter-item" placeholder="请选择" @change="orderTypeChange">
                <el-option v-for="item in dictEnum.orderType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="temp.remark" :rows="2" type="textarea" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>

        <h4 class="hd-title"> {{ templateAction.buyTitle }}</h4>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="客户">
              <el-select v-model="temp.customId" :loading="customOptsLoading" filterable remote :remote-method="customremoteSearch" class="filter-item" placeholder="搜索客户" @change="buyCustomChange">
                <el-option v-for="item in customOpts" :key="item.customId" :label="item.customName" :value="item.customId">
                  <span style="float: left">{{ item.customName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.customType }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品">
              <el-select v-model="temp.goodsId" :loading="goodsOptsLoading" filterable remote :remote-method="goodsremoteSearch" class="filter-item" placeholder="搜索商品" @change="buyGoodsChange">
                <el-option v-for="item in goodsOpts" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId">
                  <span style="float: left">{{ item.goodsName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.saleType }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量">
              <el-input v-model="temp.buyCountPail"> <template slot="suffix">桶</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="重量">
              <el-input v-model="temp.buyCountKg" @blur="buyPriceChange"> <template slot="suffix">Kg</template> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单价">
              <el-input v-model="temp.buyPrice" @blur="buyPriceChange"> <template slot="suffix">元</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总价">
              <el-input v-model="buyAmountComputed" :disabled="true"> <template slot="suffix">元</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="hd-title"> {{ templateAction.saleTitle }}</h4>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="客户">
              <el-select v-model="temp.buyCustomId" :loading="customOptsLoading" filterable remote :remote-method="customremoteSearch" class="filter-item" placeholder="客户名称" @change="saleCustomChange">
                <el-option v-for="item in customOpts" :key="item.customId" :label="item.customName" :value="item.customId">
                  <span style="float: left">{{ item.customName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.customType }}</span>
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="商品">
              <el-input v-model="temp.goodsName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量">
              <el-input v-model="temp.saleCountPail"> <template slot="suffix">桶</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="重量">
              <el-input v-model="temp.saleCountKg"> <template slot="suffix">Kg</template> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="单价">
              <el-input v-model="temp.salePrice"> <template slot="suffix">元</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-show="templateAction.percentageShow" label="含量">
              <el-input v-model="temp.percentage"> <template slot="suffix">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总价">
              <el-input v-model="saleAmountComputed" :disabled="true"> <template slot="suffix">元</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h4 class="hd-title"> 费用明细
          <el-button size="mini" type="primary" @click="addFee()">
            新增
          </el-button></h4>
        <el-row v-for="(item, index) in orderFee" :key="index" :gutter="10">

          <el-col :span="18">
            <el-form-item :label="'费用' + index">
              <el-select v-model="item.feeType" class="filter-item" placeholder="费用类型">
                <el-option v-for="i in dictEnum.feeType" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="item.feeAmount" placeholder="费用价格"> <template slot="suffix">元</template></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="item.remark" :rows="1" type="textarea" placeholder="备注" />
            </el-form-item>
            <el-button size="small" @click.prevent="removeFee(item)"> 删除</el-button>
          </el-col>

        </el-row>
        <!--
  1.select 要获取option item  需要将value=item, 但是 vmodel就无法正确对应值，选中会有问题
  2.v-for 不能获取到 temp.list 中的item
  3.@change 中进行的计算,不会实时触发改变 而是在computed中实现。

-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createOrder, updateOrder } from '@/api/order'
import { fetchList as fetchGoodsList } from '@/api/goods'
import { fetchList as fetchCustomList } from '@/api/customs'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { setTimeout } from 'timers'

export default {
  name: 'GoodsManger',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      templateAction: { buyTitle: '买入', saleTitle: '卖出', percentageShow: false },
      // vue v-model 必须要填 这里设置一下
      goodsItem: null,
      customList: null,
      num: null,
      customList2: null,

      goodsOptsLoading: true,
      customOptsLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        listQuery: undefined
      },
      // 初始商品选项 （需要查询）
      goodsOpts: [],
      customOpts: [],
      // 订单表实体
      temp: {
        goodsId: undefined,
        saleType: '',
        remark: '',
        goodsName: '',
        goodsUnit: ''
      },
      // 费用表
      orderFee: [{}],
      dialogFormVisible: false,
      dialogStatus: '',

      // 验证规则
      rules: {
        orderNo: [{ required: true, message: '必填选项', trigger: 'change' }],
        orderType: [{ required: true, message: '必填选项', trigger: 'change' }]
      }
    }
  },
  computed: {
    buyAmountComputed() {
      this.temp.buyAmount = parseFloat(this.temp.buyPrice) * parseFloat(this.temp.buyCountKg)
      return this.temp.buyAmount || 0
    },
    saleAmountComputed() {
      if (this.templateAction.percentageShow) {
        this.temp.saleAmount = parseFloat(this.temp.salePrice) * parseFloat(this.temp.saleCountKg) * (parseFloat(this.temp.percentage) * 0.01)
      } else {
        this.temp.saleAmount = parseFloat(this.temp.salePrice) * parseFloat(this.temp.saleCountKg)
      }
      console.log(this.templateAction.percentageShow, parseFloat(this.temp.salePrice), parseFloat(this.temp.saleCountKg), (parseFloat(this.temp.percentage) * 0.01), this.temp.saleAmount)
      return this.temp.saleAmount || 0
    }
  },
  // 组建生命周期
  created() {
    this.getList()
    this.getInitOpts()
  },
  methods: {
    buyPriceChange() {

    },
    salePriceChange() {
    },
    addFee() {
      this.orderFee.push({})
    },
    removeFee(item) {
      var idx = this.orderFee.indexOf(item)
      if (idx >= 0) {
        this.orderFee.splice(idx, 1)
      }
    },

    orderTypeChange(v) {
      if (v == 'BUY' || v == 'BUG_SELL' || v == 'SELL') {
        // 买卖 （这个要不要加财务明细）
        this.templateAction.percentageShow = false
      } else if (v == 'RECYCLE' || v == 'REDO' || v == 'RECYCLE_REDO') {
        // 回收加工 （这个要不要加财务明细）
        this.templateAction.buyTitle = '回收'
        this.templateAction.percentageShow = true
        this.templateAction.saleTitle = '加工'
      } else {
        // 财务明细 （这个要不要加买卖方 数量金额等）
      }
    },
    saleCustomChange(v) {
      var finder = this.customOpts.find((item) => { // 这里的selectList就是上面遍历的数据源
        return item.customId === v// 筛选出匹配数据
      })
      this.temp.buyCustomName = finder.customName
    },
    // saleGoodsChange (v,temp) {
    //   this.temp.goodsName = v.label;
    //   this.temp.goodsId = v.value;
    // },
    buyCustomChange(vId) {
      var finder = this.customOpts.find((item) => { // 这里的selectList就是上面遍历的数据源
        return item.customId === vId// 筛选出匹配数据
      })
      this.temp.customName = finder.customName
    },
    buyGoodsChange(v) {
      var finder = this.goodsOpts.find((item) => { // 这里的selectList就是上面遍历的数据源
        return item.goodsId === v// 筛选出匹配数据
      })
      this.temp.goodsName = finder.goodsName
    },
    // 远程搜索客户
    customremoteSearch(query) {
      this.customOptsLoading = true
      var queryDate
      if (!query) {
      // 没有查询字符返回 第一页商品
        queryDate = {
          page: 1,
          limit: 20
        }
      } else {
        //  有查询字符返回 返回所有符合条件的商品
        queryDate = {
          key: query
        }
      }
      fetchCustomList(queryDate).then(response => {
        this.customOpts = response.data.items
        this.customOptsLoading = false
      })
    },
    // 远程搜索商品
    goodsremoteSearch(query) {
      this.goodsOptsLoading = true
      var queryDate
      if (!query) {
      // 没有查询字符返回 第一页商品
        queryDate = {
          page: 1,
          limit: 20
        }
      } else {
        //  有查询字符返回 返回所有符合条件的商品
        queryDate = {
          key: query
        }
      }
      fetchGoodsList(queryDate).then(response => {
        this.goodsOpts = response.data.items
        this.goodsOptsLoading = false
      })
    },
    // 获取商品和客户默认值
    getInitOpts() {
      // 商品和客户列表
      this.customremoteSearch()
      this.goodsremoteSearch()
    },
    // 获取列表
    getList() {
      this.selectLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 查询
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        goodsId: undefined,
        saleType: '',
        remark: '',
        goodsName: '',
        goodsUnit: ''
      }
      this.orderFee = [{}]
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createOrder(this.temp, this.orderFee).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      // 后台获取 订单 和 费用
      this.temp = Object.assign({}, row) // copy obj
      delete this.temp.orderFee
      this.orderFee = row.orderFee
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.orderFee = this.orderFee
          updateGoods(tempData,).then(() => {
            for (const v of this.list) {
              if (v.goodsId === this.temp.goodsId) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    sortChange: function(data) {

    }

    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }
  }
}
</script>

<style scoped>
.hd-title { color:#999;}
.unit { margin: 10px 0 0 0; color:#999; }
</style>

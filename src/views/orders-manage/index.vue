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
      <el-table-column label="商品名称" prop="goodsName" width="150px" align="center" />
      <el-table-column label="客户名称" prop="customName" width="150px" align="center" />
      <el-table-column label="订单编号" prop="orderNo" width="150px" align="center" />
      <el-table-column label="销售金额" prop="salePrice" width="100px" align="center" />
      <el-table-column label="销售总额" prop="saleAmount" width="100px" align="center" />
      <el-table-column label="更新时间" prop="updateTime" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUser" width="110px" align="center" />
      <el-table-column label="修改人" prop="updateUser" width="110px" align="center" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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

    <el-dialog title="订单管理" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
       <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="temp.orderNo" />
       </el-form-item>
       <el-form-item label="商品">
          <el-select  filterable remote :remote-method="goodsremoteSearch" v-model="temp.goodsName" class="filter-item" placeholder="搜索商品">
            <el-option v-for="item in goodsOpts" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="temp.saleType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="goodsUnit">
          <el-input v-model="temp.goodsUnit" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
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
import { fetchList, createGoods, updateGoods } from '@/api/goods'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
      listQuery: {
        page: 1,
        limit: 20,
        listQuery: undefined
      },
      // 初始商品选项 （需要查询）
      goodsOpts :[{
        value: 'g01',
        label: 'A商品'
      },{
        value: 'G22',
        label: 'B商品'
      },{
        value: 'G23',
        label: 'C商品'
      }],
      // 初始客户选项 
      customsOpts : [{
        value: 'c01',
        label: '上游客户A'
      },{
        value: 'c22',
        label: '上游客户B'
      },{
        value: 'c23',
        label: '下游客户c'
      }],
      options: [{
        value: '1',
        label: '上游'
      }, {
        value: '2',
        label: '下游'
      }],
      // 表实体
      temp: {
        goodsId: undefined,
        saleType: '',
        remark: '',
        goodsName: '',
        goodsUnit: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      // 验证规则
      rules: {
        goodsName: [{ required: true, message: '必填选项', trigger: 'change' }],
        saleType: [{ required: true, message: '必填选项', trigger: 'change' }],
        goodsUnit: [{ required: true, message: '必填选项', trigger: 'change' }]
      }
    }
  },
  // 组建生命周期
  created() {
    this.getList()
  },
  methods: {
    // 远程搜索商品
    goodsremoteSearch(query) { 
      // if (query !== '') {
      //     this.loading = true;
      //     setTimeout(() => {
      //       this.loading = false;
      //       this.options = this.list.filter(item => {
      //         return item.label.toLowerCase()
      //           .indexOf(query.toLowerCase()) > -1;
      //       });
      //     }, 200);
      //   } else {
      //     this.options = [];
      //   }
    }

    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
          createGoods(this.temp).then(() => {
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
      this.temp = Object.assign({}, row) // copy obj
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
          updateGoods(tempData).then(() => {
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

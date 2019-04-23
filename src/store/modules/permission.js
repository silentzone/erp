import { asyncRoutes, constantRoutes } from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getRoute } from '@/api/permission'
/* Layout */
import Layout from '@/layout'

// const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
// import Layout from '@/views/layout' //Layout 是架构组件，不在后台返回，在文件里单独引入
const _view = file => () => import(`@/views${file}`)

function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    const {
      path,
      component
    } = route
    if (component) {
      if (component === 'Layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        var str = component
        // 这里 import 和 require 一样只能接受静态字符串定义,打包时候获取
        route.component = _view(str) // resolve => require(['@/views/permission/page'], resolve) // //
        // resolve =>{
        //   debugger;
        //   console.log(str);
        //   return require(['@/views/permission/page'], resolve)
        // }//() => import(`@${route.component}.vue`); // import(`@${route.component}.vue`);  // require([`../../views${route.component}.vue`]);    require([`@${route.component}.vue`])
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // 自己实现的动态的动态添加路由的功能
    // return new Promise((resolve, reject) => {
    //   let token = getToken();
    //   getRoute(token).then(response => {
    //     const { data } = response
    //     if (!data) {
    //       reject('Verification failed, please Login again.')
    //     }
    //     let accessedRoutes = filterAsyncRouter(data);

    //     // roles must be a non-empty array
    //     if (!accessedRoutes || accessedRoutes.length <= 0) {
    //       reject('getRoute: accessedRoutes must be a non-null array!')
    //     }

    //     commit('SET_ROUTES', accessedRoutes)
    //     resolve(accessedRoutes)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

    // 参数1 提交修改的commit 参数2 当前用户的角色名称。
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        // admin 返回全部菜单权限
        accessedRoutes = asyncRoutes || []
      } else {
        // 过滤返回定义好的角色信息权限
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

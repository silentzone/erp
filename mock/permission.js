
const asyncRoutes = [ 
   {
    path: '/permission',
    component: 'Layout',
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '基础管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: '/permission/page',
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: '/permission/directive',
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: '/permission/role',
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  }, 
 ];




export default [
  // user login
  {
    url: '/permission/route',
    type: 'get',
    response: config => {
      console.log(typeof asyncRoutes);
 

      return {
        code: 20000,
        data: asyncRoutes
      }
    }
  }

  

 
]

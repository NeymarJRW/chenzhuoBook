import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
    path: '/menu',
    name: 'menu',
    // redirect: "/menu/bookinfo",
    component: () => import("../components/Index.vue"),
    children: [{
        path: '/menu/bookinfo',
        name: 'bookinfo',
        component: () => import('../views/Bookinfo.vue')
      },
      {
        path: '/menu/userinfo',
        name: 'userinfo',
        component: () => import('../views/Userinfo.vue')
      },
      {
        path: '/menu/roleinfo',
        name: 'roleinfo',
        component: () => import('../views/Roleinfo.vue')
      }
    ]
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue")
  }

]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
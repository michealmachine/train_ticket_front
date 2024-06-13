import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useInfoStore } from '@/stores/userinfo.store'
const userInfoStore = useInfoStore()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      redirect:'/home/admin-home',
      children:[
        {
          path:'admin-home',
          name:'admin-home',
          component:()=>import('@/components/home/AdminHome.vue')
        },
        {
          path:'user',
          name:'user',
          component:()=>import('@/components/users/UserManagement.vue')
        },
        {
          path:'station',
          name:'station',
          component:()=>import('@/components/system/TrainStation.vue')
        },
        {
          path:'trainNumber',
          name:'trainNumber',
          component:()=>import('@/components/system/TrainNumer.vue')
        },
        {
          path:'tickManage',
          name:'tickManage',
          component:()=>import('@/components/system/TickManage.vue')
        },
        {
          path:'buyTicket',
          name:'buyTicket',
          component:()=>import('@/components/system/BuyTicket.vue')
        },
        {
          path:'cart',
          name:'cart',
          component:()=>import('@/components/system/Cart.vue')
        },
        {
          path:'cartView',
          name:'cartView',
          component:()=>import('@/components/system/CartView.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'login',
      meta: {
        noAuth: true
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  if (to.meta.noAuth||userInfoStore.authFromLocal()) {
    return true
  } else {
    return '/login'
  }
})

export default router

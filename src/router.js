import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/domain.local/chart/'
    },
    {
      path: '/domain.local/chart/',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
      children: [
        {
          path: "hourly",
          component: () => import('./views/Dashboard.vue'),
          name: "hourly"
        },
        {
          path: "daily",
          component: () => import('./views/Dashboard.vue'),
          name: "daily"
        },
        {
          path: "monthly",
          component: () => import('./views/Dashboard.vue'),
          name: "monthly"
        }
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  next()
})
export default router;
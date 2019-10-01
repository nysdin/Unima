import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'

Vue.use(Router)

//{ requiresAuth: true } => ログイン必須、していない場合は/loginへ飛ばす
//{ public: true } => そのまま遷移を許可する
//meta情報なし　=> ログインユーザーがアクセスすることを禁止 rootURLへ飛ばす

const ifNotAuthenticated = (to, from, next) => {
  if(!store.getters['auth/isAuthenticated']){
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if(store.getters['auth/isAuthenticated']){
    next() 
    return 
  }
  next('/login')
}

const nextAuth = (to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    //ログインしていない人が入れないようにしている
    ifAuthenticated(to, from, next)
  }else if(to.matched.some(record => record.meta.public)){
    //誰でも閲覧可能
    next()
  }else{
    //ログインしている人が入れないようにしている
    ifNotAuthenticated(to, from, next)
  }
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { public: true },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ './views/Search.vue'),
      meta: { public: true }
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import(/* webpackChunkName: "mypage" */ './views/MyPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mypage/sell',
      name: 'mypageSell',
      component: () => import(/* webpackChunkName: "mypageSell" */ './views/MyPageSell.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mypage/purchase',
      name: 'mypagePurchase',
      component: () => import(/* webpackChunkName: "mypagePurchase" */ './views/MyPagePurchase.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage/like',
      name: 'mypageLike',
      component: () => import(/* webpackChunkName: "mypageLike" */ './views/MyPageLike.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/u/edit',
      name: 'userEdit',
      component: () => import(/* webpackChunkName: "userEdit" */ './views/UserEdit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/u/:id',
      name: 'userShow',
      component: () => import(/* webpackChunkName: "userShow" */ './views/UserShow.vue'),
      meta: { public: true },
    },
    {
      path: '/password_reset',
      name: 'passwordReset',
      component: () => import(/* webpackChunkName: "passwordReset" */ './views/PasswordReset.vue'),
    },
    {
      path: '/password/edit',
      name: 'passwordEdit',
      component: () => import(/* webpackChunkName: "passwordEdit" */ './views/PasswordEdit.vue'),
      meta: { public: true },
    },
    {
      path: '/sell',
      name: 'sell',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "sell" */ './views/Sell.vue')
    },
    {
      path: '/sell/:id/edit',
      name: 'sellEdit',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "sellEdit" */ './views/SellEdit.vue')
    },
    {
      path: '/product/:id',
      name: 'productShow',
      meta: { public: true },
      component: () => import(/* webpackChunkName: "productShow" */ './views/ProductShow.vue')
    },
    {
      path: '/product/:id/trade',
      name: 'Trade',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "trade" */ './views/Trade.vue')
    },
    {
      path: '/payment/:id',
      name: 'PurchaseConfirmation',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "purchaseConfirmation" */ './views/PurchaseConfirmation.vue'),
    },
    {
      path: '/settings/bank',
      name: 'BankAccount',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "bankAccount" */ './views/BankAccount.vue')
    },
    {
      path: '/settings/card',
      name: 'Card',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "bankAccount" */ './views/Card.vue')
    },
    {
      path: '/settings/card/create',
      name: 'CardCreate',
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "bankAccount" */ './views/CardCreate.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(!store.getters['auth/init']){
    //初期表示なら認証チェックした後にフックを確立
    const unwatch = store.watch( (state, getters) => getters['auth/init'], () => {
      unwatch()
      nextAuth(to, from, next)
    })
  }else{
    nextAuth(to, from,next)
  }
})

export default router
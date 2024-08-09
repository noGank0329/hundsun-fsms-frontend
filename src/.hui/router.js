import { initRouter, initRouterLayout } from '@hsui/core'

export default initRouter(
  [
    {
      path: '/',
      component: initRouterLayout((layout) => {
        return import('@/layouts/' + layout + '.vue')
      }),
      children: [
        {
          name: 'index',
          path: '',
          component: Index,
        },
        {
          name: 'AccountSettlement',
          path: 'AccountSettlement',
          component: AccountSettlement,
        },
        {
          name: 'BankCardManagement',
          path: 'BankCardManagement',
          component: BankCardManagement,
        },
        {
          name: 'BusinessQuery',
          path: 'BusinessQuery',
          component: BusinessQuery,
        },
        {
          name: 'CancelOrder',
          path: 'CancelOrder',
          component: CancelOrder,
        },
        {
          name: 'Consult',
          path: 'Consult',
          component: Consult,
        },
        {
          name: 'CreateAccount',
          path: 'CreateAccount',
          component: CreateAccount,
        },
        {
          name: 'Home',
          path: 'Home',
          component: Home,
        },
        {
          name: 'ProductManagement',
          path: 'ProductManagement',
          component: ProductManagement,
        },
        {
          name: 'Purchase',
          path: 'Purchase',
          component: Purchase,
        },
        {
          name: 'Redemption',
          path: 'Redemption',
          component: Redemption,
        },
        {
          name: 'TeamIntroduction',
          path: 'TeamIntroduction',
          component: TeamIntroduction,
        },
        {
          name: 'TransactionQuery',
          path: 'TransactionQuery',
          component: TransactionQuery,
        },
        {
          name: '__404__',
          path: '*',
          component: __404__,
        },
      ],
    },
  ],
  { base: '/', mode: 'hash' }
)

function Index() {
  return import(/* webpackChunkName: "index" */ '@/views/index.vue')
}
function AccountSettlement() {
  return import(
    /* webpackChunkName: "AccountSettlement" */ '@/views/AccountSettlement.vue'
  )
}
function BankCardManagement() {
  return import(
    /* webpackChunkName: "BankCardManagement" */ '@/views/BankCardManagement.vue'
  )
}
function BusinessQuery() {
  return import(
    /* webpackChunkName: "BusinessQuery" */ '@/views/BusinessQuery.vue'
  )
}
function CancelOrder() {
  return import(/* webpackChunkName: "CancelOrder" */ '@/views/CancelOrder.vue')
}
function Consult() {
  return import(/* webpackChunkName: "Consult" */ '@/views/Consult.vue')
}
function CreateAccount() {
  return import(
    /* webpackChunkName: "CreateAccount" */ '@/views/CreateAccount.vue'
  )
}
function Home() {
  return import(/* webpackChunkName: "Home" */ '@/views/Home.vue')
}
function ProductManagement() {
  return import(
    /* webpackChunkName: "ProductManagement" */ '@/views/ProductManagement.vue'
  )
}
function Purchase() {
  return import(/* webpackChunkName: "Purchase" */ '@/views/Purchase.vue')
}
function Redemption() {
  return import(/* webpackChunkName: "Redemption" */ '@/views/Redemption.vue')
}
function TeamIntroduction() {
  return import(
    /* webpackChunkName: "TeamIntroduction" */ '@/views/TeamIntroduction.vue'
  )
}
function TransactionQuery() {
  return import(
    /* webpackChunkName: "TransactionQuery" */ '@/views/TransactionQuery.vue'
  )
}
function __404__() {
  return import(/* webpackChunkName: "__404__" */ '@/views/__404__.vue')
}

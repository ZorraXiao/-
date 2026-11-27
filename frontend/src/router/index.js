import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

export const routes = [
  // 独立认证页（不套外框）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { title: '登录 / 注册', guestOnly: true },
  },

  // 前台通用布局（MainLayout）
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '首页' },
      },

      // 二手交易（成员 4）—— /create 必须定义在 /:id 之前
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('@/views/products/ProductListView.vue'),
        meta: { title: '商品大厅' },
      },
      {
        path: 'products/create',
        name: 'ProductCreate',
        component: () => import('@/views/products/ProductCreateView.vue'),
        meta: { title: '发布商品', requiresAuth: true },
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('@/views/products/ProductDetailView.vue'),
        meta: { title: '商品详情' },
      },

      // 失物招领（成员 5）—— /create 必须定义在 /:id 之前
      {
        path: 'lost-found',
        name: 'LostFoundList',
        component: () => import('@/views/lost-found/LostFoundListView.vue'),
        meta: { title: '信息大厅' },
      },
      {
        path: 'lost-found/create',
        name: 'LostFoundCreate',
        component: () => import('@/views/lost-found/LostFoundCreateView.vue'),
        meta: { title: '发布失物 / 寻物', requiresAuth: true },
      },
      {
        path: 'lost-found/:id',
        name: 'LostFoundDetail',
        component: () => import('@/views/lost-found/LostFoundDetailView.vue'),
        meta: { title: '信息详情' },
      },

      // 跑腿服务—— /create 必须定义在 /:id 之前
      {
        path: 'errands',
        name: 'ErrandList',
        component: () => import('@/views/errands/ErrandListView.vue'),
        meta: { title: '任务大厅' },
      },
      {
        path: 'errands/create',
        name: 'ErrandCreate',
        component: () => import('@/views/errands/ErrandCreateView.vue'),
        meta: { title: '发布跑腿', requiresAuth: true },
      },
      {
        path: 'errands/:id',
        name: 'ErrandDetail',
        component: () => import('@/views/errands/ErrandDetailView.vue'),
        meta: { title: '任务详情' },
      },

      // 个人中心（均需登录）
      {
        path: 'profile/content/:kind(products|lost-found|errands)/:id',
        name: 'ProfileContentDetail',
        component: () => import('@/features/profile-admin/ContentDetailView.vue'),
        meta: { title: '记录详情', requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人中心', requiresAuth: true },
      },
      {
        path: 'profile/posts',
        name: 'ProfilePosts',
        component: () => import('@/views/profile/MyPostsView.vue'),
        meta: { title: '我的发布', requiresAuth: true },
      },
      {
        path: 'profile/errands',
        name: 'ProfileErrands',
        component: () => import('@/views/profile/MyErrandsView.vue'),
        meta: { title: '我的接单任务', requiresAuth: true },
      },
    ],
  },

  // 后台管理布局（AdminLayout，均需管理员权限）
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/users',
    meta: { title: '后台管理', requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'content/:kind(products|lost-found|errands)/:id',
        name: 'AdminContentDetail',
        component: () => import('@/features/profile-admin/ContentDetailView.vue'),
        meta: { title: '内容详情', adminContentDetail: true },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { title: '商品管理', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'lost-found',
        name: 'AdminLostFound',
        component: () => import('@/views/admin/AdminLostFoundView.vue'),
        meta: { title: '失物管理', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'errands',
        name: 'AdminErrands',
        component: () => import('@/views/admin/AdminErrandsView.vue'),
        meta: { title: '跑腿管理', requiresAuth: true, requiresAdmin: true },
      },
    ],
  },

  // 404 独立兜底页（不套外框）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { title: '页面不存在' },
  },
]

export function installRouterGuards(targetRouter) {
  targetRouter.beforeEach((to) => {
    const authStore = useAuthStore()
    const guestOnly = to.matched.some((record) => record.meta.guestOnly)
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

    // 已登录用户访问仅访客页（如 /login）：管理员跳 /admin，普通用户跳 /
    if (guestOnly && authStore.isLoggedIn) {
      return authStore.isAdmin ? { path: '/admin' } : { path: '/' }
    }

    // 未登录访问需要认证的页面：重定向至登录页并携带 redirect
    if (requiresAuth && !authStore.isLoggedIn) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    // 非管理员访问管理员页面：提示无权限并跳转首页
    if (requiresAdmin && !authStore.isAdmin) {
      ElMessage.warning('无权限访问后台管理页面')
      return { path: '/' }
    }

    return true
  })

  targetRouter.afterEach((to) => {
    if (typeof document !== 'undefined') {
      const pageTitle = to.meta?.title
      document.title = pageTitle ? `${pageTitle} - 校园交易平台` : '校园交易平台'
    }
  })
}

const history =
  typeof window !== 'undefined' && window.history
    ? createWebHistory(import.meta.env.BASE_URL)
    : createMemoryHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

installRouterGuards(router)

export default router

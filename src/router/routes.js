const routes = [
  {
    path: '/',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '', name: 'Dashboard', alias: 'AppLogger', component: () => import('pages/Index.vue') },
      {
        path: 'language-constant',
        name: 'LanguageConstant',
        redirect: 'language-constant/search',
        component: () => import('pages/LanguageConstant.vue'),
        children: [
          {
            path: 'search',
            alias: 'search',
            name: 'LanguageConstant.Search',
            component: () => import('components/Search.vue'),
          },
          {
            path: 'insert',
            name: 'LanguageConstant.Insert',
            component: () => import('components/Insert.vue'),
          },
          {
            path: 'duplicates',
            name: 'LanguageConstant.Duplicates',
            component: () => import('components/Duplicates.vue'),
          },
          {
            path: 'nonlocalised',
            name: 'LanguageConstant.Nonlocalised',
            component: () => import('components/Nonlocalised.vue'),
          },
          {
            path: 'status',
            name: 'LanguageConstant.EnvStatus',
            component: () => import('components/Status.vue'),
          },
        ]
      },
      {
        path: 'zuora',
        name: 'Zuora',
        component: () => import('pages/Zuora.vue'),
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

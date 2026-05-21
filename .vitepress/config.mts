import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "EnderRealm DOCS",
  description: "EnderRealm 官方文档站点",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '协议与政策',
        items: [
          { text: 'EnderRealm 基本章程', link: '/协议与政策/EnderRealm基本章程' },
          { text: 'EnderRealm 玩家守则', link: '/协议与政策/EnderRealm玩家守则' },
          { text: 'EnderRealm 隐私政策', link: '/协议与政策/EnderRealm隐私政策' },
          { text: 'EnderRealm 用户协议', link: '/协议与政策/EnderRealm用户协议' }
        ]
      }
    ],

    sidebar: [
      {
        text: '协议与政策',
        items: [
          { text: 'EnderRealm 基本章程', link: '/协议与政策/EnderRealm基本章程' },
          { text: 'EnderRealm 玩家守则', link: '/协议与政策/EnderRealm玩家守则' },
          { text: 'EnderRealm 隐私政策', link: '/协议与政策/EnderRealm隐私政策' },
          { text: 'EnderRealm 用户协议', link: '/协议与政策/EnderRealm用户协议' }

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EnderRealmMC/EnderRealm-DOCS' }
    ],

    outline: {
      label: '页面导航'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '重置搜索',
            footer: {
              selectText: '选择',
              navigateText: '导航',
              closeText: '关闭'
            }
          }
        }
      }
    },

    footer: {
      copyright: '© 2022-present EnderRealm. All rights reserved.'
    }
  }
})

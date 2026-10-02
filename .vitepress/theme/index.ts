// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import GameplayInfoCard from './components/GameplayInfoCard.vue'
import HomeHero from './components/HomeHero.vue'
import HomeQuickIndex from './components/HomeQuickIndex.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 首页内容整体由自定义组件渲染（仅 layout: home 时该槽位生效），
      // index.md 只保留 layout: home 的 frontmatter
      'home-hero-after': () => h('div', [h(HomeHero), h(HomeQuickIndex)])
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('GameplayInfoCard', GameplayInfoCard)
  }
} satisfies Theme

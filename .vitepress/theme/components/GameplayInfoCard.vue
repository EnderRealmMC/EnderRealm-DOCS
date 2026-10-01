<script setup>
/**
 * 玩法图鉴通用信息卡（仿 wiki Infobox）
 *
 * 样式与站点主题令牌完全一致：card 底色、edge 描边、accent 强调、全局直角，
 * 全部取自 .vitepress/theme/style.css 的 --color-* 变量，暗色模式自动适配。
 * 图片通过默认插槽传入 Markdown 图片语法，保证资源被 Vite 正常打包。
 */
defineProps({
  title: { type: String, required: true },
  rows: { type: Array, default: () => [] },
  footer: { type: String, default: '' }
})
</script>

<template>
  <aside class="gic">
    <p class="gic-title">{{ title }}</p>
    <div class="gic-media">
      <slot />
    </div>
    <dl class="gic-rows">
      <div v-for="(row, i) in rows" :key="i" class="gic-row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
    </dl>
    <p v-if="footer" class="gic-footer">{{ footer }}</p>
  </aside>
</template>

<style scoped>
.gic {
  background-color: var(--color-card);
  border: 1px solid var(--color-edge);
  padding: 0.9rem 1.1rem;
  margin: 1rem auto;
  max-width: 420px;
  font-size: 0.92rem;
}

.gic-title {
  margin: 0 0 0.6rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-accent-light);
  letter-spacing: 0.02em;
}

.gic-media {
  margin: 0 0 0.75rem;
}

.gic-media :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--color-edge);
}

.gic-rows {
  margin: 0;
}

.gic-row {
  display: flex;
  gap: 0.75rem;
  padding: 0.35rem 0;
  border-top: 1px solid var(--color-edge);
}

.gic-row dt {
  flex: 0 0 5.5em;
  color: var(--color-ink-2);
}

.gic-row dd {
  margin: 0;
  color: var(--color-ink);
}

.gic-footer {
  margin: 0.6rem 0 0;
  color: var(--color-ink-2);
  font-size: 0.85rem;
}
</style>

<script setup lang="ts">
import { quickIndexCards, joinCards, communityCard, bibleBlock } from '../homeIndexData'
</script>

<template>
  <!-- 快速索引：官方规则类文档，逐篇列出 -->
  <section class="home-index">
    <div class="home-container">
      <p class="home-kicker">快速索引</p>
      <div class="home-grid">
        <article
          v-for="card in quickIndexCards"
          :key="card.href"
          class="home-card home-card-accent"
          :class="{ 'home-card-wide': card.wide }"
        >
          <component :is="card.icon" class="home-card-icon" :size="28" :stroke-width="1.8" />
          <h3 class="home-card-title">
            <a :href="card.href">{{ card.title }}<span class="home-card-arrow">→</span></a>
          </h3>
          <ul v-if="card.links" class="home-card-links">
            <li v-for="link in card.links" :key="link.href">
              <a :href="link.href">{{ link.text }}</a>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <!-- 参与我们：原 hero 按钮的入口并入这里 -->
  <section class="home-index home-index-alt">
    <div class="home-container">
      <p class="home-kicker home-kicker-center">参与我们</p>
      <div class="home-grid home-grid-3">
        <article v-for="card in joinCards" :key="card.href" class="home-card home-card-plain">
          <component :is="card.icon" class="home-card-icon" :size="28" :stroke-width="1.8" />
          <h3 class="home-card-title">
            <a :href="card.href">{{ card.title }}<span class="home-card-arrow">→</span></a>
          </h3>
          <p v-if="card.desc" class="home-card-desc">{{ card.desc }}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- 社区文档：玩法图鉴（整行卡片） -->
  <section class="home-index">
    <div class="home-container">
      <p class="home-kicker">社区文档</p>
      <article class="home-card home-card-accent home-card-row">
        <div class="home-card-row-main">
          <component :is="communityCard.icon" class="home-card-icon" :size="28" :stroke-width="1.8" />
          <h3 class="home-card-title">
            <a :href="communityCard.href">{{ communityCard.title }}<span class="home-card-arrow">→</span></a>
          </h3>
          <p v-if="communityCard.desc" class="home-card-desc">{{ communityCard.desc }}</p>
        </div>
        <ul v-if="communityCard.links" class="home-card-links home-card-row-links">
          <li v-for="link in communityCard.links" :key="link.href">
            <a :href="link.href">{{ link.text }}</a>
          </li>
        </ul>
      </article>
    </div>
  </section>

  <!-- 圣经：收尾区块，居中，只给分类入口 -->
  <section class="home-index home-bible">
    <div class="home-container">
      <p class="home-kicker home-kicker-center">{{ bibleBlock.kicker }}</p>
      <h2 class="home-bible-title">
        <a :href="bibleBlock.href">{{ bibleBlock.title }}<span class="home-card-arrow">→</span></a>
      </h2>
      <p class="home-card-desc">{{ bibleBlock.desc }}</p>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight, ArrowUpRight, Bike, FileText, PackageSearch, Plus, ShoppingBag } from 'lucide-vue-next'
import StatusTag from '@/components/StatusTag.vue'

const previewRows = [
  { id: 1, status: 'on_sale', widthMain: '64%', widthSub: '38%' },
  { id: 2, status: null, widthMain: '52%', widthSub: '32%' },
  { id: 3, status: 'off_shelf', widthMain: '58%', widthSub: '42%' },
]

const flowSteps = [
  { num: '01', title: '发布信息', desc: '描述清楚物品或需求' },
  { num: '02', title: '站内沟通', desc: '确认细节与交付方式' },
  { num: '03', title: '校内交付', desc: '就近面交或送达' },
  { num: '04', title: '确认完结', desc: '双方确认，信息归档' },
]

const shortcuts = [
  { label: '发布闲置', to: '/products/create', icon: Plus },
  { label: '登记失物', to: '/lost-found/create', icon: PackageSearch },
  { label: '发起跑腿', to: '/errands/create', icon: Bike },
  { label: '我的发布', to: '/profile/posts', icon: FileText },
]
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <p class="home-hero__eyebrow">面向本校师生 · 校内闭环</p>
      <h1 class="home-hero__title">
        让闲置、失物与跑腿，<br />在校园里就近流转。
      </h1>
      <p class="home-hero__desc">
        校园交易平台连接同校师生：发布闲置、登记失物、委托跑腿，从沟通到交付都在校内完成。
      </p>
      <div class="home-hero__actions">
        <router-link to="/products">
          <el-button type="primary" size="large" class="home-hero__primary-btn">
            <span>浏览二手好物</span>
            <ArrowRight :size="16" :stroke-width="1.5" />
          </el-button>
        </router-link>
        <router-link to="/products/create">
          <el-button size="large">发布闲置</el-button>
        </router-link>
      </div>
    </section>

    <section class="home-bento" aria-label="核心服务入口">
      <article class="bento-card bento-card--trade">
        <div class="bento-card__top">
          <span class="bento-card__icon" aria-hidden="true">
            <ShoppingBag :size="16" :stroke-width="1.5" />
          </span>
          <h2 class="bento-card__title bento-card__title--lg">二手交易</h2>
          <p class="bento-card__desc">教材、数码、宿舍好物，同校面交更放心。</p>
        </div>

        <div class="bento-preview" aria-hidden="true">
          <div v-for="row in previewRows" :key="row.id" class="bento-preview__row">
            <span class="bento-preview__thumb" />
            <div class="bento-preview__lines">
              <span class="bento-preview__bar" :style="{ width: row.widthMain }" />
              <span class="bento-preview__bar is-sub" :style="{ width: row.widthSub }" />
            </div>
            <div class="bento-preview__meta">
              <span class="ct-mono bento-preview__price">¥ --.--</span>
              <StatusTag v-if="row.status" type="product" :status="row.status" size="small" />
            </div>
          </div>
        </div>

        <div class="bento-card__footer bento-card__footer--split">
          <router-link to="/products" class="ct-link">
            <span>进入商品大厅</span>
            <ArrowRight :size="15" :stroke-width="1.5" />
          </router-link>
          <router-link to="/products/create" class="bento-card__sublink">发布商品</router-link>
        </div>
      </article>

      <article class="bento-card bento-card--lost-found">
        <div class="bento-card__top">
          <span class="bento-card__icon" aria-hidden="true">
            <PackageSearch :size="16" :stroke-width="1.5" />
          </span>
          <h2 class="bento-card__title">失物招领</h2>
          <p class="bento-card__desc">丢了东西先来这里看看，捡到物品一键登记。</p>
        </div>
        <div class="bento-card__footer">
          <router-link to="/lost-found" class="ct-link">
            <span>查看信息大厅</span>
            <ArrowRight :size="15" :stroke-width="1.5" />
          </router-link>
        </div>
      </article>

      <article class="bento-card bento-card--errands">
        <div class="bento-card__top">
          <span class="bento-card__icon" aria-hidden="true">
            <Bike :size="16" :stroke-width="1.5" />
          </span>
          <h2 class="bento-card__title">跑腿服务</h2>
          <p class="bento-card__desc">取快递、带饭、代送文件，顺路的同学就能接单。</p>
        </div>
        <div class="bento-card__footer">
          <router-link to="/errands" class="ct-link">
            <span>进入任务大厅</span>
            <ArrowRight :size="15" :stroke-width="1.5" />
          </router-link>
        </div>
      </article>

      <article class="bento-card bento-card--flow">
        <h3 class="bento-card__section-title">平台闭环</h3>
        <div class="bento-flow">
          <div v-for="step in flowSteps" :key="step.num" class="bento-flow__step">
            <span class="ct-mono bento-flow__num">{{ step.num }}</span>
            <p class="bento-flow__title">{{ step.title }}</p>
            <p class="bento-flow__desc">{{ step.desc }}</p>
          </div>
        </div>
      </article>

      <article class="bento-card bento-card--shortcuts">
        <h3 class="bento-card__section-title">快捷入口</h3>
        <div class="bento-shortcuts">
          <router-link
            v-for="item in shortcuts"
            :key="item.to"
            :to="item.to"
            class="bento-shortcut"
          >
            <span class="bento-shortcut__left">
              <component :is="item.icon" :size="15" :stroke-width="1.5" class="bento-shortcut__icon" />
              <span>{{ item.label }}</span>
            </span>
            <ArrowUpRight :size="14" :stroke-width="1.5" class="bento-shortcut__arrow" />
          </router-link>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
}

.home-hero {
  padding: 24px 0 56px;
}

.home-hero__eyebrow {
  font-size: var(--ct-font-size-sm);
  font-weight: 500;
  color: var(--ct-text-tertiary);
}

.home-hero__title {
  margin-top: 14px;
  font-size: var(--ct-font-size-display);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: var(--ct-tracking-tight);
  color: var(--ct-text-primary);
}

.home-hero__desc {
  margin-top: 20px;
  max-width: 560px;
  font-size: var(--ct-font-size-lg);
  line-height: 1.6;
  color: var(--ct-text-secondary);
}

.home-hero__actions {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

:deep(.home-hero__primary-btn > span) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.home-bento {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto;
  gap: 16px;
}

.bento-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: var(--ct-bg-surface);
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-lg);
  transition: var(--ct-transition);
}

.bento-card:hover {
  border-color: var(--ct-border-strong);
}

.bento-card--trade {
  grid-column: 1 / 8;
  grid-row: 1 / 3;
}

.bento-card--lost-found {
  grid-column: 8 / 13;
  grid-row: 1;
}

.bento-card--errands {
  grid-column: 8 / 13;
  grid-row: 2;
}

.bento-card--flow {
  grid-column: 1 / 9;
  grid-row: 3;
  background-color: var(--ct-bg-canvas);
}

.bento-card--shortcuts {
  grid-column: 9 / 13;
  grid-row: 3;
}

.bento-card__icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ct-border);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  color: var(--ct-text-primary);
}

.bento-card__title {
  margin-top: 16px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: var(--ct-tracking-tight);
  color: var(--ct-text-primary);
}

.bento-card__title--lg {
  font-size: var(--ct-font-size-xl);
}

.bento-card__desc {
  margin-top: 6px;
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-secondary);
}

.bento-preview {
  margin-top: 20px;
  padding: 12px 16px;
  border: 1px dashed var(--ct-border-dashed);
  border-radius: var(--ct-radius-md);
  background-color: var(--ct-bg-canvas);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bento-preview__row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ct-border);
}

.bento-preview__row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.bento-preview__thumb {
  width: 36px;
  height: 36px;
  border-radius: var(--ct-radius-sm);
  background-color: var(--ct-bg-subtle);
  border: 1px solid var(--ct-border);
  flex-shrink: 0;
}

.bento-preview__lines {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bento-preview__bar {
  display: block;
  height: 9px;
  border-radius: 4px;
  background-color: var(--ct-border);
}

.bento-preview__bar.is-sub {
  height: 7px;
  background-color: var(--ct-bg-subtle);
}

.bento-preview__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.bento-preview__price {
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.bento-card__footer {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  align-items: center;
}

.bento-card__footer--split {
  justify-content: space-between;
  gap: 12px;
}

.bento-card__sublink {
  font-size: var(--ct-font-size-sm);
  color: var(--ct-text-secondary);
  transition: var(--ct-transition);
}

.bento-card__sublink:hover {
  color: var(--ct-text-primary);
}

.bento-card__section-title {
  font-size: var(--ct-font-size-sm);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.bento-flow {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.bento-flow__step {
  padding: 4px 16px;
  border-left: 1px solid var(--ct-border);
}

.bento-flow__step:first-child {
  padding-left: 0;
  border-left: none;
}

.bento-flow__step:last-child {
  padding-right: 0;
}

.bento-flow__num {
  display: block;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-tertiary);
}

.bento-flow__title {
  margin-top: 6px;
  font-size: var(--ct-font-size-base);
  font-weight: 600;
  color: var(--ct-text-primary);
}

.bento-flow__desc {
  margin-top: 2px;
  font-size: var(--ct-font-size-xs);
  color: var(--ct-text-secondary);
}

.bento-shortcuts {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
}

.bento-shortcut {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 8px;
  margin: 0 -8px;
  border-radius: var(--ct-radius-sm);
  border-bottom: 1px solid var(--ct-border);
  font-size: var(--ct-font-size-base);
  color: var(--ct-text-primary);
  transition: var(--ct-transition);
}

.bento-shortcut:last-child {
  border-bottom: none;
}

.bento-shortcut:hover {
  background-color: var(--ct-bg-subtle);
}

.bento-shortcut__left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.bento-shortcut__icon,
.bento-shortcut__arrow {
  color: var(--ct-text-tertiary);
  transition: var(--ct-transition);
}

.bento-shortcut:hover .bento-shortcut__arrow {
  color: var(--ct-accent);
  transform: translate(1px, -1px);
}

@media (max-width: 960px) {
  .bento-card--trade,
  .bento-card--lost-found,
  .bento-card--errands,
  .bento-card--flow,
  .bento-card--shortcuts {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .bento-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .bento-flow__step {
    padding: 0;
    border-left: none;
  }
}

@media (max-width: 520px) {
  .home-hero {
    padding: 12px 0 36px;
  }

  .bento-flow {
    grid-template-columns: 1fr;
  }
}
</style>

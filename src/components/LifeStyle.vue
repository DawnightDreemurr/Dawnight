<template>
  <div class="indices-container">
    <!-- 加载状态 -->
    <Loading v-if="loading" text="加载生活指数中..." />

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <p>⚠️ 加载失败: {{ error }}</p>
      <button @click="fetchIndices">重试</button>
    </div>

    <!-- 正常显示 -->
    <div v-else class="content-wrapper">
      <!-- 生活指数 -->
      <div class="indices-section">
        <div class="section-header">
          <h3>今日生活指数</h3>
        </div>

        <div class="indices-grid">
          <div v-for="(item, index) in indicesData.daily" :key="index" class="index-card">
            <div class="index-header">
              <div class="index-name">{{ item.name }}</div>
              <div :class="`level-${item.level}`" class="index-level">{{ item.category }}</div>
            </div>
            <div class="index-text">{{ item.text }}</div>
          </div>
        </div>
      </div>

      <!-- 公司信息 -->
      <div class="company-info">
        <div class="info-section">
          <h4>气象服务提供商</h4>
          <p> 和风天气 · QWeather</p>
          <a :href="indicesData.fxLink" target="_blank">查看原始数据</a>
        </div>

        <div class="info-section">
          <h4>关于我</h4>
          <p>DawnightDreemurr</p>
          <svg class="sign-svg" fill="none" height="104.19861602783203"
               viewBox="0 0 627.8624572753906 104.19861602783203"
               width="627.8624572753906" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- 定义线性渐变 -->
              <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
            <path ref="signSvg"
                  d="M71.976 2.08092C50.826 32.5309 1.47598 103.581 7.97598 83.0809C14.476 62.5809 73.476 -5.41908 112.976 2.08092C152.476 9.58092 38.976 105.081 1.97598 96.0809C13.476 64.0809 91.3385 50.1395 123.476 47.5909C118.826 54.9409 107.976 72.0909 103.976 62.0909C99.976 52.0909 116.476 48.0909 119.976 65.5909C103.976 65.5909 131.476 57.6009 139.976 47.6009C128.976 56.1051 123.976 76.6109 144.976 54.1109C139.976 72.6109 156.976 75.6209 156.976 47.6209C162.476 69.6294 206.976 47.1409 184.976 50.6409C169.476 65.5976 168.976 73.6409 180.976 62.1409C192.976 50.6409 189.976 46.6409 193.476 59.1409C196.976 71.6409 224.476 47.6409 217.476 47.6409C210.476 47.6409 202.476 69.1409 209.976 65.6409C217.476 62.1409 274.476 30.6409 252.476 62.1409C230.476 93.6409 191.476 121.641 196.476 86.1409C199.976 76.6439 214.476 58.6509 263.476 62.1509C252.476 80.1536 287.976 20.1609 299.476 20.1609C294.976 27.1609 252.476 64.1709 257.976 70.1709C267.476 62.1486 283.476 38.1709 283.476 59.1709C294.976 62.1537 298.988 56.7989 299.476 54.1809C292.126 63.9309 274.976 86.6809 274.976 89.6809C274.976 92.6809 321.476 20.1809 325.476 20.1809C329.476 20.1809 323.976 32.6809 320.476 32.6809C316.976 32.6809 258.976 38.6809 274.976 35.6809C290.976 32.6809 374.476 24.6809 365.976 32.6809C355.476 35.6809 370.476 6.67092 381.476 1.67092C392.476 -3.32908 308.476 102.171 314.476 82.1709C320.476 62.1709 393.976 -11.8291 425.476 4.17092C456.976 20.1709 324.476 106.671 311.976 98.1709C299.476 89.6709 420.976 42.1709 425.476 48.1709C429.976 54.1709 419.113 62.3209 413.976 65.1709C416.076 62.1709 420.976 55.1709 443.476 48.1709C443.476 59.6709 443.476 65.1784 454.976 55.1809C456.026 52.3294 458.476 45.6809 452.476 48.1809C446.476 50.6809 433.476 72.1809 448.476 65.1809C463.476 58.1809 476.976 59.6809 476.976 55.1809C476.976 50.6809 464.976 45.1809 464.976 65.1809C482.976 73.1809 500.976 47.6809 504.476 44.6809C507.976 41.6809 482.476 73.6809 489.476 71.1809C496.476 68.6809 508.976 20.1809 504.476 59.6809C504.476 65.1809 519.976 41.1909 522.976 48.1909C525.976 55.1909 511.476 67.1909 533.476 59.6909C546.976 55.1809 540.476 48.1936 543.976 48.1936C547.476 48.1936 527.476 70.6936 538.476 65.1936C549.476 59.6936 556.476 48.1936 556.476 48.1936C554.226 52.9936 548.976 64.1936 558.976 59.6936C568.976 55.1936 567.476 68.1936 571.476 65.1936C575.476 62.1936 576.476 48.1936 581.476 48.1936C586.476 48.1936 591.476 51.6936 591.476 48.1936C591.476 44.6936 599.976 48.1936 599.976 48.1936C598.326 55.0936 594.476 71.1936 599.976 59.6936C605.476 48.1936 612.476 44.1936 612.476 48.1936C612.476 52.1936 627.476 48.1936 627.476 48.1936"
                  stroke="url(#grad1)"
                  stroke-dasharray="2750"
                  stroke-dashoffset="2750"
                  stroke-linejoin="round"
                  stroke-width="3"
            >
                            <animate attributeName="stroke-dashoffset" to="0" dur="3s" fill="freeze"/>
            </path>
          </svg>
          <div class="github" onclick="window.location.href='https://github.com/DawnightDreemurr/weather-app'" >
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" >
              <path
                d="M12 0.296997C5.37 0.296997 0 5.67 0 12.297C0 17.6 3.438 22.097 8.205 23.682C8.805 23.795 9.025 23.424 9.025 23.105C9.025 22.82 9.015 22.065 9.01 21.065C5.672 21.789 4.968 19.455 4.968 19.455C4.422 18.07 3.633 17.7 3.633 17.7C2.546 16.956 3.717 16.971 3.717 16.971C4.922 17.055 5.555 18.207 5.555 18.207C6.625 20.042 8.364 19.512 9.05 19.205C9.158 18.429 9.467 17.9 9.81 17.6C7.145 17.3 4.344 16.268 4.344 11.67C4.344 10.36 4.809 9.29 5.579 8.45C5.444 8.147 5.039 6.927 5.684 5.274C5.684 5.274 6.689 4.952 8.984 6.504C9.944 6.237 10.964 6.105 11.984 6.099C13.004 6.105 14.024 6.237 14.984 6.504C17.264 4.952 18.269 5.274 18.269 5.274C18.914 6.927 18.509 8.147 18.389 8.45C19.154 9.29 19.619 10.36 19.619 11.67C19.619 16.28 16.814 17.295 14.144 17.59C14.564 17.95 14.954 18.686 14.954 19.81C14.954 21.416 14.939 22.706 14.939 23.096C14.939 23.411 15.149 23.786 15.764 23.666C20.565 22.092 24 17.592 24 12.297C24 5.67 18.627 0.296997 12 0.296997Z"
                fill="white"></path>
            </svg>
          </div>
        </div>
        <div class="info-section">
          <h4>Made with</h4>
          <a href="https://cn.vuejs.org/"
             style="color: #42b983; font-weight: bold; font-size: 24px; border-radius: 4px; transition: all 0.3s ease;">Vue</a>
          <a href="https://alvarotrigo.com/fullPage/zh/"
             style="color: #ff5e45; font-weight: bold; font-size: 24px; border-radius: 4px;transition: all 0.3s ease;">Fullpage.js</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Loading from './Loading.vue'
import { getWeatherIndexForecast } from '@/apis/weatherApis.js'

const loading = ref(true)
const error = ref(null)
const signSvg = ref()

const indicesData = ref({
  updateTime: '',
  fxLink: '',
  daily: [],
  refer: {
    sources: [],
    license: []
  }
})
const props = defineProps({
  locationId: {
    type: String,
    default: ''
  }
})
// 模拟数据获取
const fetchIndices = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await getWeatherIndexForecast(props.locationId)

    const data = result.data

    indicesData.value = {
      updateTime: data.updateTime,
      fxLink: data.fxLink,
      daily: data.daily,
      refer: data.refer
    }
  } catch (err) {
    error.value = err.message || '获取数据失败'
  } finally {
    loading.value = false
  }
}
watch(props, (value, oldValue, onCleanup) => {
  fetchIndices()
}, { immediate: true, deep: true })
// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '--'
  try {
    const date = new Date(timeString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return timeString.split('T')[1]?.substring(0, 5) || '--'
  }
}

onMounted(() => {
  fetchIndices()

})

</script>


<style scoped>
.indices-container {
  background: transparent;
  border-radius: 12px;
  padding: 20px;
  margin: 0 auto;
  width: 95vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  overflow-x: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.update-time {
  font-size: 12px;
  color: #fff;
}

.indices-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 固定 3 列 */
  grid-template-rows: repeat(2, auto); /* 固定 2 行 */
  gap: 16px;
  margin-bottom: 30px;
}

.indices-section {
  min-width: auto;
  overflow: auto;
}

.index-card {
  border-radius: 8px;
  background: rgba(240, 240, 240, 0.3);
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.index-name {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

.index-level {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
}

.level-1 {
  background: #e8f5e9;
  color: #2e7d32;
  white-space: nowrap;
}

/* 适宜 */
.level-2 {
  background: #f1f8e9;
  color: #5a9216;
  white-space: nowrap;
}

/* 较适宜 */
.level-3 {
  background: #fff8e1;
  color: #ff8f00;
  white-space: nowrap;
}

/* 一般 */
.level-4 {
  background: #ffebee;
  color: #c62828;
  white-space: nowrap;
}

/* 不宜 */
.level-5 {
  background: #f3e5f5;
  color: #6a1b9a;
  white-space: nowrap;
}

/* 极不宜 */
.level-7 {
  background: #fff3e0;
  color: #e65100;
  white-space: nowrap;
}

/* 炎热 */

.index-text {
  font-size: 13px;
  line-height: 1.5;
  color: #fff;
}

.company-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 固定 3 列 */
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-items: center;
  gap: 8px;
}

.info-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.info-section p {
  margin: 0;
  font-size: 13px;
  color: #fff;
  line-height: 1.5;
}

.info-section a {
  color: #4285f4;
  font-size: 13px;
  text-decoration: none;
}

.info-section a:hover {
  text-decoration: underline;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #fff;
}

.error-message p {
  margin-bottom: 12px;
}

.error-message button {
  background: #fff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.error-message button:hover {
  background: #fff;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.sign-svg {
  height: 30px;
  width: auto;
}
.github{
  cursor: pointer;
}
.github:hover svg path {
  fill: #fa7268;
}
@media (max-width: 600px) {
  .index-card {
    font-size: 10px;
  }
}

@media (max-width: 1200px) {
  .company-info {
    margin-top: 40px;
  }
}
</style>

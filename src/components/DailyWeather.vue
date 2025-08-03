<template>
  <div class="daily-weather">
    <!-- 加载状态 -->
    <Loading v-if="loading" weather-type="cloudy" text="加载天气预报中..." />

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <p>⚠️ 加载预报失败: {{ error }}</p>
      <button @click="fetchDailyWeather">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!dailyData || dailyData.length === 0" class="empty-message">
      <p>暂无天气预报数据</p>
    </div>

    <!-- 正常显示 -->
    <div v-else class="forecast-container">
      <div class="header">
        <h3>七日天气预报</h3>

      </div>

      <div class="weather-scroll">
        <div class="weather-cards">
          <div v-for="(day, index) in dailyData" :key="index" class="day-card">
            <div class="date-section">
              <div class="weekday">{{ formatWeekday(day.fxDate, index) }}</div>
              <div class="date">{{ formatDate(day.fxDate) }}</div>
            </div>

            <div class="weather-icons">
              <div class="day-weather">
                <i :class="`qi-${day.iconDay}`"></i>
                <span class="weather-text">{{ day.textDay }}</span>
              </div>
              <div class="night-weather">
                <i :class="`qi-${day.iconNight}`"></i>
                <span class="weather-text">{{ day.textNight }}</span>
              </div>
            </div>

            <div class="temp-section">
              <div class="temp-max">{{ day.tempMin }}° ~</div>
              <div class="temp-min">{{ day.tempMax }}°</div>
            </div>

            <div class="detail-section">
              <div class="detail-item">
                <i class="qi-wind"></i>
                <span>{{ day.windDirDay }} {{ day.windScaleDay }}级</span>
              </div>
              <div class="detail-item">
                <i class="qi-humidity"></i>
                <span>相对湿度:{{ day.humidity }}%</span>
              </div>
              <div class="detail-item">
                <i class="qi-uv-index"></i>
                <span>紫外线强度：{{ getUvLevel(day.uvIndex) }}</span>
              </div>
              <div class="detail-item" v-if="parseFloat(day.precip) > 0">
                <i class="qi-rain"></i>
                <span>降水量:{{ day.precip }}mm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Loading from './Loading.vue'
import { getDailyWeather } from '@/apis/weatherApis.js'

// 模拟props，实际使用时可以从父组件传入
const props = defineProps({
  locationId: {
    type: String,
    default: ''
  }
})

const loading = ref(true)
const error = ref(null)
const dataSource = ref({
  updateTime: '',
  fxLink: '',
  daily: []
})

// 获取每日天气数据
const fetchDailyWeather = async () => {
  try {
    loading.value = true
    error.value = null

    const result = await getDailyWeather(props.locationId)
    const data = result.data


    if (data.code === "200") {
      dataSource.value = {
        updateTime: data.updateTime,
        fxLink: data.fxLink,
        daily: data.daily
      }
    } else {
      throw new Error("获取天气预报数据失败")
    }
  } catch (err) {
    error.value = err.message || "网络请求失败"
  } finally {
    loading.value = false
  }
}
watch(props, (value, oldValue, onCleanup) => {
  fetchDailyWeather()
}, { immediate: true,deep:true })
// 计算属性
const dailyData = computed(() => {
  return dataSource.value.daily.slice(0, 7) // 只显示7天
})

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '未知时间'
  try {
    const date = new Date(timeString)
    return date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch {
    return timeString
  }
}

// 格式化日期 (MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return '--'
  try {
    const date = new Date(dateString)
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  } catch {
    return dateString.split('-').slice(1).join('-') || '--'
  }
}

// 格式化星期几
const formatWeekday = (dateString, index) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  if (index === 0) return '今天'

  try {
    const date = new Date(dateString)
    return weekdays[date.getDay()]
  } catch {
    return index < weekdays.length ? weekdays[index] : `第${index + 1}天`
  }
}

// 获取紫外线等级描述
const getUvLevel = (uvIndex) => {
  const index = parseInt(uvIndex) || 0
  if (index <= 2) return '弱'
  if (index <= 5) return '中等'
  if (index <= 7) return '强'
  if (index <= 10) return '很强'
  return '极强'
}

// 初始化获取数据
onMounted(() => {
  fetchDailyWeather()
})
</script>
<style scoped>
.daily-weather {
  background: transparent;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin: 0 auto;
  width: 95vw;
  overflow-x: auto;
  color:#fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.update-time {
  font-size: 12px;
  color: #fff;
}

.weather-scroll {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
}

.weather-cards {
  display: flex;
  gap: 12px;
  min-width: max-content;
  justify-content: space-evenly;
}

.day-card {
  border-radius: 8px;
  background: rgba(240, 240, 240, 0.3);
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 150px;
  flex-shrink: 0;
}

.date-section {
  text-align: center;
  margin-bottom: 12px;
}

.weekday {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.date {
  font-size: 12px;
  color: #fff;
}

.weather-icons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.day-weather,
.night-weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.day-weather i,
.night-weather i {
  font-size: 28px;
}

.day-weather i {
  color: #4285f4;
}

.night-weather i {
  color: #6c757d;
}

.weather-text {
  font-size: 12px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}

.temp-section {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.temp-max {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.temp-min {
  font-size: 20px;
  font-weight: 500;
  color: #fff;
}

.detail-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #fff;
}

.detail-item i {
  font-size: 14px;
  color: #fff;
}

.error-message,
.empty-message {
  text-align: center;
  padding: 20px;
  color: #fff;
}

.error-message p {
  margin-bottom: 12px;
}

.error-message button {
  background: #333;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.error-message button:hover {
  background: #555;
}

/* 滚动条样式 */
.weather-scroll::-webkit-scrollbar {
  height: 6px;
}

.weather-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.weather-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.weather-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 480px) {
  .daily-weather {
    border-radius: 0;
    box-shadow: none;
    padding: 16px;
  }

  .day-card {
    min-width: 140px;
    padding: 12px;
  }

  .day-weather i,
  .night-weather i {
    font-size: 24px;
  }
}
</style>

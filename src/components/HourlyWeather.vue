<template>
  <div class="hourly-weather">
    <!-- 加载状态 -->
    <Loading v-if="loading" text="加载小时预报中..." weather-type="cloudy" />

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <p>⚠️ 加载小时预报失败: {{ error }}</p>
      <button @click="fetchHourlyWeather">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!hourlyData || hourlyData.length === 0" class="empty-message">
      <p>暂无逐小时预报数据</p>
    </div>

    <!-- 正常显示 -->
    <div v-else class="forecast-container">
      <div class="header">
        <h3>24小时预报</h3>
      </div>


      <div class="hours-container">
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div ref="hourlyList" class="hourly-list">
          <div
            v-for="(hour, index) in hourlyData"
            :key="index"
            :class="{ 'active': activeHour === index }"
            class="hour-item"
            @click="scrollToHour(index)"
          >
            <div class="time">{{ index === 0 ? '现在' : formatHour(hour.fxTime) }}</div>
            <div class="icon">
              <i :class="`qi-${hour.icon}`"></i>
            </div>
            <div class="temp">{{ hour.temp }}°</div>
            <div class="wind">
              <i class="qi-wind"></i>
              <span>{{ hour.windScale }}级</span>
            </div>
            <div v-if="hour.pop > 0" class="pop">
              <span class="pop-value">{{ hour.pop }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Loading from './Loading.vue'
import Chart from 'chart.js/auto'
import { getHourlyWeather } from '@/apis/weatherApis.js'

const props = defineProps({
  locationId: {
    type: String,
    default: ''
  }
})


const result = ref()
const loading = ref(true)
const error = ref(null)
const dataSource = ref({ hourly: [] })
const chartCanvas = ref(null)
const hourlyList = ref(null)
const activeHour = ref(0)
let chartInstance = null

// 获取逐小时天气数据
const fetchHourlyWeather = async () => {
  try {
    loading.value = true
    error.value = null

    result.value = await getHourlyWeather(props.locationId)

    if (result.value.data.code === '200') {
      dataSource.value = {
        updateTime: result.value.data.updateTime,
        fxLink: result.value.data.fxLink,
        hourly: result.value.data.hourly
      }
    } else {
      throw new Error('获取逐小时预报数据失败')
    }
  } catch (err) {
    error.value = err.message || '网络请求失败'
  } finally {
    loading.value = false
  }
}
watch(props, (value, oldValue, onCleanup) => {
  fetchHourlyWeather(props.locationId)
}, { immediate: true,deep:true })
// 计算属性
const hourlyData = computed(() => {
  return dataSource.value.hourly?.slice(0, 24) || []
})

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '未知时间'
  try {
    const date = new Date(timeString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return timeString
  }
}

// 格式化小时
const formatHour = (timeString) => {
  if (!timeString) return '--:--'
  try {
    const date = new Date(timeString)
    return `${date.getHours()}:00`
  } catch {
    const [hour] = timeString.split('T')[1]?.split(':') || []
    return hour ? `${hour}:00` : '--:--'
  }
}

// 滚动到指定小时
const scrollToHour = (index) => {
  activeHour.value = index
  if (hourlyList.value && hourlyList.value.children[index]) {
    const hourElement = hourlyList.value.children[index]
    const container = hourlyList.value
    const containerWidth = container.clientWidth
    const scrollLeft = hourElement.offsetLeft - (containerWidth - hourElement.clientWidth) / 2

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    })
  }
}

// 初始化图表
const initChart = () => {
  if (!hourlyData.value.length || !chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  // 销毁旧图表
  if (chartInstance) {
    chartInstance.destroy()
  }

  const labels = hourlyData.value.map((_, i) => i === 0 ? '现在' : `${i}时`)
  const temps = hourlyData.value.map(h => parseInt(h.temp))
  const pops = hourlyData.value.map(h => parseInt(h.pop))

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '温度 (°C)',
          data: temps,
          borderColor: '#4285f4',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'y',
          pointBackgroundColor: (ctx) =>
            ctx.dataIndex === activeHour.value ? '#4285f4' : 'rgba(66, 133, 244, 0.5)',
          pointRadius: (ctx) =>
            ctx.dataIndex === activeHour.value ? 5 : 3,
          pointHoverRadius: 6
        },
        {
          label: '降水概率 (%)',
          data: pops,
          borderColor: '#34a853',
          backgroundColor: 'rgba(52, 168, 83, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'y1',
          borderDash: [5, 5],
          hidden: pops.every(p => p === 0),
          pointBackgroundColor: (ctx) =>
            ctx.dataIndex === activeHour.value ? '#34a853' : 'rgba(52, 168, 83, 0.5)',
          pointRadius: (ctx) =>
            ctx.dataIndex === activeHour.value ? 5 : 3,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            color: '#fff'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          titleColor: '#000',
          bodyColor: '#000',
          borderColor: 'rgba(255, 255, 255, 0.0)'
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#fff'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#fff'
          },
          title: {
            display: true,
            text: '温度 (°C)',
            color: '#fff'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#fff'
          },
          title: {
            display: true,
            text: '降水概率 (%)',
            color: '#fff'
          },
          min: 0,
          max: 100
        }
      },
      onClick: (e) => {
        if (chartInstance) {
          const points = chartInstance.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: false },
            true
          )
          if (points.length) {
            const firstPoint = points[0]
            activeHour.value = firstPoint.index
            scrollToHour(firstPoint.index)
          }
        }
      }
    }
  })
}

// 监听数据变化更新图表
watch(hourlyData, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

// 监听activeHour变化
watch(activeHour, () => {
  if (chartInstance) {
    chartInstance.update()
  }
})

// 初始化获取数据
onMounted(() => {
  fetchHourlyWeather()
})
</script>

<style scoped>
.hourly-weather {
  background: transparent;
  padding: 16px;
  margin: 0 auto;
  max-width: 95vw;
  overflow: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.chart-container {
  position: relative;
  height: 200px;
  margin-bottom: 16px;
  background: transparent;
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
}

.hours-container {
  width: 90vw;

}

.hourly-list {
  width: auto;
  display: flex;
  justify-content: space-evenly;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  gap: 12px;
}

.hour-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: 8px 4px;
  border-radius: 8px;
  background: rgba(240, 240, 240, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.hour-item.active {
  background: rgba(66, 133, 244, 0.1);
  box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.3);
}

.time {
  font-size: 12px;
  color: #fff;
  margin-bottom: 4px;
}

.icon i {
  font-size: 24px;
  color: #4285f4;
  margin: 4px 0;
}

.temp {
  font-size: 16px;
  font-weight: 500;
  margin: 4px 0;
}

.pop {
  font-size: 10px;
  color: #34a853;
  margin: 2px 0;
}

.wind {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #fff;
  margin-top: 2px;
}

.wind i {
  font-size: 12px;
  margin-right: 2px;
}

.error-message, .empty-message {
  text-align: center;
  padding: 20px;
  color: #4DC7A0;
}

.error-message p {
  margin-bottom: 12px;
}

.error-message button {
  background: #4285f4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.error-message button:hover {
  background: #3367d6;
}

/* Webkit浏览器（Chrome/Safari/Edge）的滚动条样式 */
.hourly-list::-webkit-scrollbar {
  height: 1px; /* 水平滚动条高度（变得更细） */
}

.hourly-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* 滚动条颜色 */
  border-radius: 2px; /* 圆角 */
}

.hourly-list::-webkit-scrollbar-track {
  background-color: transparent; /* 滚动条轨道透明 */
}

@media (max-width: 480px) {
  .hourly-weather {
    border-radius: 0;
    box-shadow: none;
  }

  .chart-container {
    height: 180px;
  }

  .hour-item {
    min-width: 50px;
  }
}
</style>

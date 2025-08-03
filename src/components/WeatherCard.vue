<template>
  <!-- 加载状态 -->
  <Loading
    v-if="loading"
    :full-screen="false"
    text="正在加载天气数据..."
    weather-type="sunny"
  />

  <!-- 天气卡片 -->
  <div v-else class="weather-card">

    <!-- 头部 - 当前天气概况 -->
    <div class="weather-header">
      <div class="weather-icon">
        <i :class="`qi-${weatherData.data.now.icon}`"></i>

      </div>
      <div class="weather-summary">
        <h2>{{ weatherData.data.now.text }}</h2>
        <div class="temperature">{{ weatherData.data.now.temp }}°C</div>
        <div class="feels-like">体感温度: {{ weatherData.data.now.feelsLike }}°C</div>

      </div>
      <LocationSearch v-model="currentLocation" />
    </div>


    <!-- 天气详情 -->
    <div class="weather-details">
      <div class="detail-item">
        <svg class="icon" height="30" p-id="9149" t="1754114941573" version="1.1"
             viewBox="0 0 1024 1024" width="30" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M334.915327 733.720777c-5.27719 0-10.313903-3.091408-12.539594-8.262174-1.705851-3.970428-2.332115-6.901177-3.385097-11.779278-0.49221-2.291183-1.1328-5.27719-2.104941-9.380648-1.719154-7.322779 2.824325-14.678304 10.153244-16.410762 7.275707-1.65264 14.671141 2.825348 16.416901 10.154267 1.01205 4.337795 1.692548 7.482415 2.212388 9.907651 0.905626 4.210905 1.146103 5.250584 1.785669 6.715959 2.971681 6.928806-0.226151 14.950504-7.141654 17.935488C338.552158 733.347271 336.727603 733.720777 334.915327 733.720777z"
            fill="#272636" p-id="9150"></path>
          <path
            d="M491.102552 860.978113c-0.613984 0-1.225921-0.025583-1.852184-0.106424-60.150962-8.207939-113.319905-42.37511-145.886625-93.704149-4.037966-6.370081-2.145873-14.791891 4.224208-18.84316 6.342452-4.02364 14.777565-2.158153 18.828834 4.238534 28.237111 44.534286 74.356498 74.142627 126.512369 81.257675 7.476275 1.013073 12.698207 7.889691 11.686157 15.35164C503.682056 856.022241 497.817488 860.978113 491.102552 860.978113z"
            fill="#272636" p-id="9151"></path>
          <path
            d="M512.30341 957.589474c-161.557536 0-293.000194-131.442658-293.000194-293.007357 0-104.245226 151.577231-443.271686 190.30016-520.492418 25.851784-51.54291 61.84351-79.925331 101.367689-79.925331 22.799262 0 66.293869 10.367115 101.527324 79.805604 40.827871 80.486102 192.805214 415.235143 192.805214 520.612145C805.303604 826.145793 673.860946 957.589474 512.30341 957.589474zM510.971066 118.744451c-17.283642 0-36.938284 18.614963-52.569286 49.810453-47.425126 94.544283-184.517457 411.94419-184.517457 496.027214 0 131.475404 106.949824 238.426251 238.419088 238.426251 131.470287 0 238.419088-106.950847 238.419088-238.426251 0-82.790588-132.655276-388.984269-186.889481-495.919766C547.736411 136.933719 528.467555 118.744451 510.971066 118.744451z"
            fill="#ffffff" p-id="9152"></path>
        </svg>
        <span>湿度: {{ weatherData.data.now.humidity }}%</span>
      </div>
      <div class="detail-item">
        <svg class="icon" height="30" p-id="10153" t="1754114993264" version="1.1"
             viewBox="0 0 1024 1024" width="30" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M174.5 394.1h331.2c91 0 166-73.2 166.3-164.2 0.3-91-73.7-165.1-164.7-165.1-43.2 0-84 16.6-114.9 46.7-15.5 15.1-27.7 32.9-36.2 52.2-12.7 29.1 8.4 61.7 40.1 62.6 18.5 0.5 35.2-10.4 42.6-27.3 11.6-26.2 37.7-44.2 68.3-44.2 41.4 0 75.1 33.9 74.7 75.4-0.4 41.1-34.5 73.9-75.6 73.9H174.5c-24.9 0-45 20.1-45 45s20.2 45 45 45zM189.3 634.2l0.6 45-0.6-45zM682 626.9c-0.6 0-0.8 0-427.3 6.3-7.3 0.1-14.2 0.2-20.5 0.3-24.8 0.4-44.7 20.8-44.3 45.6 0.3 24.9 20.8 44.8 45.7 44.4 6.3-0.1 13.2-0.2 20.5-0.3 124.9-1.9 415.3-6.2 426.2-6.3 42.8 0.2 77.2 36.5 74.2 80-2.8 39.8-35.9 70-75.7 69.3-30.2-0.5-55.9-18.5-67.2-44.5-7.3-16.8-24.1-27.5-42.5-27-31.7 0.9-52.8 33.5-40.1 62.6 8.4 19.4 20.6 37.1 36.2 52.2 30.9 30.1 71.8 46.7 115 46.7 91.8-0.1 166.8-77 164.5-168.8-2.3-88.9-75.3-160.5-164.7-160.5z"
            fill="#ffffff" p-id="10154"></path>
          <path
            d="M856.6 240.3c-29-11.5-60.5 10.1-60.5 41.4v1.3c0 18 10.9 34.4 27.6 41.1 27.5 11 47 38 47 69.4 0 41.2-33.5 74.7-74.7 74.7H112.6c-24.9 0-45 20.1-45 45s20.1 45 45 45h683.5c90.8 0 164.7-73.9 164.7-164.7-0.1-69.5-43.3-129-104.2-153.2z"
            fill="#ffffff" p-id="10155"></path>
        </svg>
        <span>风速: {{ weatherData.data.now.windScale }}级 ({{ weatherData.data.now.windSpeed }}km/h)</span>
      </div>
      <div class="detail-item">
        <svg class="icon" height="30" p-id="11237" t="1754115022591" version="1.1"
             viewBox="0 0 1024 1024" width="30" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M528.64 449.728l112.8-112.768a32 32 0 1 1 45.12 45.12l-111.488 111.488a64 64 0 1 1-46.4-43.84zM801.76 672h-192a32 32 0 0 1 0-64h192a32 32 0 1 1 0 64z m0 160h-64a32 32 0 0 1 0-64h64a32 32 0 1 1 0 64z m-192 0h-296.96a112.32 112.32 0 1 1 0-224h104.96a32 32 0 0 1 0 64h-104.96a48.32 48.32 0 1 0 0 96h296.96a32 32 0 0 1 0 64z m-253.76-521.6l9.92 9.92a32 32 0 0 1-22.4 54.4 32 32 0 0 1-22.72-9.28l-9.792-9.76A254.72 254.72 0 0 0 259.744 480h30.016a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32c0-176.736 143.264-320 320-320s320 143.264 320 320a32 32 0 0 1-32 32h-64a32 32 0 0 1 0-64h30.016a256.128 256.128 0 0 0-222.016-222.016V288a32 32 0 1 1-64 0v-30.016a254.752 254.752 0 0 0-125.76 52.416z"
            fill="#ffffff" p-id="11238"></path>
        </svg>
        <span>气压: {{ weatherData.data.now.pressure }}hPa</span>
      </div>
      <div class="detail-item">
        <i>
          <svg class="icon" height="30" p-id="8098" t="1754114779161" version="1.1"
               viewBox="0 0 1024 1024" width="30" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M80 536.533c18.133 0 32-13.866 32-32 0-61.866 50.133-112 112-112 4.267 0 11.733 1.067 19.2 2.134v29.866c0 18.134 13.867 32 32 32s32-13.866 32-32v-51.2c17.067-100.266 103.467-172.8 204.8-172.8s187.733 72.534 204.8 172.8v51.2c0 18.134 13.867 32 32 32s32-13.866 32-32v-29.866c7.467-1.067 14.933-2.134 19.2-2.134 61.867 0 112 50.134 112 112 0 18.134 13.867 32 32 32s32-13.866 32-32c0-97.066-78.933-176-176-176-8.533 0-18.133 1.067-26.667 3.2-33.066-115.2-138.666-195.2-261.333-195.2s-227.2 78.934-261.333 194.134c-9.6-2.134-19.2-3.2-26.667-3.2-97.067 0-176 78.933-176 176 0 18.133 13.867 33.066 32 33.066z m304 96c0 18.134 13.867 32 32 32h576c18.133 0 32-13.866 32-32s-13.867-32-32-32H416c-18.133 0-32 13.867-32 32z m128 80c-18.133 0-32 13.867-32 32s13.867 32 32 32h432c18.133 0 32-13.866 32-32s-13.867-32-32-32H512z m480 112H608c-18.133 0-32 13.867-32 32s13.867 32 32 32h384c18.133 0 32-13.866 32-32s-13.867-32-32-32z m-960-160h288c18.133 0 32-13.866 32-32s-13.867-32-32-32H32c-18.133 0-32 13.867-32 32 0 17.067 13.867 32 32 32z m48 48c-18.133 0-32 13.867-32 32s13.867 32 32 32h336c18.133 0 32-13.866 32-32s-13.867-32-32-32H80z m432 112H32c-18.133 0-32 13.867-32 32s13.867 32 32 32h480c18.133 0 32-13.866 32-32s-13.867-32-32-32z"
              fill="#ffffff" p-id="8099"></path>
          </svg>
        </i>
        <span>能见度: {{ weatherData.data.now.vis }}km</span>
      </div>
    </div>

    <!-- 空气质量 -->
    <div
      :style="{backgroundColor: `rgba(${airData.data.indexes[0].color.red}, ${airData.data.indexes[0].color.green}, ${airData.data.indexes[0].color.blue}, 0.2)`}"
      class="air-quality">

      <div class="aqi-display">
        <div class="aqi-value">{{ airData.data.indexes[0].aqiDisplay }}</div>
        <div class="aqi-info">
          <div class="aqi-level">{{ airData.data.indexes[0].category }}</div>
          <div class="primary-pollutant">主要污染物: {{ airData.data.indexes[0].primaryPollutant?.fullName || '无' }}
          </div>
        </div>
      </div>
      <div class="pollutants">
        <div v-for="pollutant in airData.data.pollutants" :key="pollutant.code" class="pollutant-item">
          <span class="pollutant-name">{{ pollutant.fullName }}</span>
          <span class="pollutant-value">{{ pollutant.concentration.value }}{{ pollutant.concentration.unit }}</span>
        </div>
      </div>
      <div class="health-advice">
        <p>{{ airData.data.indexes[0].health.effect }}</p>
        <p><strong>建议:</strong> {{ airData.data.indexes[0].health.advice.generalPopulation }}</p>
      </div>
    </div>

    <!-- 更新时间 -->
    <div class="update-time">
      更新时间: {{ formatTime(weatherData.data.updateTime) }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Loading from './Loading.vue'
import LocationSearch from '@/components/LocationSearch.vue'
import { useUserStore } from '@/stores/counter.js'
import { storeToRefs } from 'pinia'
import { getNowAirQuality, getWeatherNow } from '@/apis/weatherApis.js'

const loading = ref(true)
const weatherData = ref(null)
const airData = ref(null)

const userStore = useUserStore()
const { currentLocation } = storeToRefs(userStore)

const fetchData = async () => {
  try {
    // console.log(currentLocation.value.id+'内部')
    weatherData.value = await getWeatherNow(currentLocation.value.id)
    airData.value = await getNowAirQuality(currentLocation.value.id)
    loading.value = false
  } catch (error) {
    console.error('获取天气数据失败:', error)
    loading.value = false
  }
}

watch(currentLocation, (value, oldValue, onCleanup) => {
  userStore.changeLocation(value)
  fetchData()
}, { immediate: true,deep:true })


// 模拟异步获取数据


// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {
  fetchData()
})
</script>


<style scoped>
.weather-card {
  margin-top: 40px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weather-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-icon i {
  font-size: 64px;
}

.weather-summary {
  display: flex;
  flex-direction: column;
}

.temperature {
  font-size: 32px;
  font-weight: bold;
  margin: 4px 0;
}

.location {
  font-size: 25px;
  border-bottom: 1px dashed currentColor; /* 仅底部虚线 */
  padding-bottom: 4px; /* 仅底部添加内边距 */
}

.feels-like {
  font-size: 14px;
  color: #fff;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.detail-item i {
  font-size: 20px;
}

.air-quality {
  padding: 16px;
  border-radius: 8px;
}

.aqi-display {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 12px 0;
}

.aqi-value {
  font-size: 36px;
  font-weight: bold;
}

.aqi-info {
  display: flex;
  flex-direction: column;
}

.aqi-level {
  font-weight: bold;
  font-size: 16px;
}

.primary-pollutant {
  font-size: 14px;
  color: #fff;
}

.pollutants {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.pollutant-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.health-advice {
  font-size: 14px;
  line-height: 1.5;
}

.health-advice p {
  margin: 8px 0;
}

.update-time {
  font-size: 12px;
  color: #999;
  text-align: right;
}

@media (max-width: 768px) {
  .weather-icon i {
    font-size: 48px;
  }

  .temperature {
    font-size: 28px;
  }


  .pollutants {
    grid-template-columns: 1fr;
  }

  .aqi-value {
    font-size: 32px;
  }
}
</style>

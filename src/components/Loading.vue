<template>
  <div class="weather-loader" :class="{ 'full-screen': fullScreen }">
    <!-- 根据天气类型显示不同动画 -->
    <div class="weather-animation">
      <!-- 晴天 -->
      <div v-if="displayType === 'sunny'" class="sun-holder">
        <div class="sun"></div>
      </div>

      <!-- 雨天 -->
      <div v-if="displayType === 'rainy'" class="rain-holder">
        <div class="rain" v-for="i in 15" :key="i" :style="rainStyle(i)"></div>
      </div>

      <!-- 多云 -->
      <div v-if="displayType === 'cloudy'" class="cloud-holder">
        <div class="cloud"></div>
        <div class="cloud delayed"></div>
      </div>

      <!-- 雪天 -->
      <div v-if="displayType === 'snowy'" class="snow-holder">
        <div class="snowflake" v-for="i in 12" :key="i" :style="snowStyle(i)"></div>
      </div>
    </div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '获取天气数据中'
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  weatherType: {
    type: String,
    default: 'random',
    validator: (value) => ['sunny', 'rainy', 'cloudy', 'snowy', 'random'].includes(value)
  }
})

const types = ['sunny', 'rainy', 'cloudy', 'snowy']
const displayType = ref(props.weatherType === 'random'
  ? types[Math.floor(Math.random() * types.length)]
  : props.weatherType)

// 雨滴样式
const rainStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDuration: `${0.5 + Math.random() * 1.5}s`,
    animationDelay: `${Math.random() * 0.5}s`
  }
}

// 雪花样式
const snowStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDuration: `${5 + Math.random() * 5}s`,
    animationDelay: `${Math.random() * 2}s`,
    opacity: 0.5 + Math.random() * 0.5,
    transform: `scale(${0.5 + Math.random() * 0.7})`
  }
}
</script>

<style scoped>
.weather-loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  overflow: hidden;
  background-color: transparent;
}

.weather-loader.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.95);
}

.weather-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

/* 晴天样式 */
.sun-holder {
  position: relative;
  width: 100%;
  height: 100%;
}

.sun {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: #FFD700;
  border-radius: 50%;
  box-shadow: 0 0 30px #FFD700;
  animation: sunPulse 2s infinite alternate;
}

@keyframes sunPulse {
  0% { transform: translate(-50%, -50%) scale(0.95); }
  100% { transform: translate(-50%, -50%) scale(1.05); }
}

/* 雨天样式 */
.rain-holder {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.rain {
  position: absolute;
  width: 2px;
  height: 15px;
  background: #7FB2E9;
  border-radius: 1px;
  animation: rainFall linear infinite;
  top: -20px;
}

@keyframes rainFall {
  to {
    transform: translateY(140px);
  }
}

/* 多云样式 */
.cloud-holder {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  width: 60px;
  height: 20px;
  background: #ECF0F1;
  border-radius: 20px;
  top: 40%;
  left: 30%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  animation: cloudMove 3s infinite ease-in-out;
}

.cloud::before, .cloud::after {
  content: '';
  position: absolute;
  background: #ECF0F1;
  border-radius: 50%;
}

.cloud::before {
  width: 25px;
  height: 25px;
  top: -15px;
  left: 10px;
}

.cloud::after {
  width: 35px;
  height: 35px;
  top: -20px;
  right: 10px;
}

.cloud.delayed {
  top: 60%;
  left: 40%;
  opacity: 0.7;
  animation: cloudMove 4s infinite ease-in-out 1s;
}

@keyframes cloudMove {
  0%, 100% { transform: translateX(-20px); }
  50% { transform: translateX(20px); }
}

/* 雪天样式 */
.snow-holder {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  filter: blur(1px);
  animation: snowFall linear infinite;
  top: -10px;
}

@keyframes snowFall {
  to {
    transform: translateY(130px) rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-top: 10px;
  text-align: center;
  position: relative;
}

.loading-text::after {
  content: '...';
  position: absolute;
  animation: dotPulse 1.5s infinite steps(3);
  width: 0;
  overflow: hidden;
}

@keyframes dotPulse {
  to { width: 1.2em; }
}
</style>


<!--
<Loading
  weather-type="rainy"
  text="正在加载降水数据..."
  :full-screen="true"
/>
-->

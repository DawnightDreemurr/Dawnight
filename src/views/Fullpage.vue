
<template>
  <div class="fullpage-container">
    <!-- 背景图片层 -->
    <div class="background-image"></div>
    <!-- 头部导航 -->
    <header ref="header" class="header">
      <div class="logo">
        <i class="fas fa-cube"></i>
        <img :src="Logo" alt="logo" style="width: 200px;
  height: auto;">
      </div>
      <nav ref="navMenu" class="nav-menu" @click="toggleMobileMenu">
        <a :class="{ active: activeSection === 0 }" class="nav-link"
           @click.prevent="scrollToSection(0)">当前天气</a>
        <a :class="{ active: activeSection === 1 }" class="nav-link"
           @click.prevent="scrollToSection(1)">24小时预报</a>
        <a :class="{ active: activeSection === 2 }" class="nav-link"
           @click.prevent="scrollToSection(2)">七日预报</a>
        <a :class="{ active: activeSection === 3 }" class="nav-link"
           @click.prevent="scrollToSection(3)">生活指数</a>
      </nav>
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <i class="fas fa-bars">≡</i>
      </button>
    </header>

    <!-- 全屏滚动内容 -->
    <div ref="fullpageWrapper" class="fullpage-wrapper">
      <section :class="{ active: activeSection === 0 }" class="section">
        <WeatherCard></WeatherCard>
      </section>

      <section :class="{ active: activeSection === 1 }" class="section">
        <hourly-weather :locationId="currentLocation.id"></hourly-weather>
      </section>

      <section :class="{ active: activeSection === 2 }" class="section">
        <daily-weather :locationId="currentLocation.id"></daily-weather>
      </section>

      <section :class="{ active: activeSection === 3 }" class="section">
        <life-style :locationId="currentLocation.id"></life-style>
      </section>
    </div>

    <!-- 右侧导航点 -->
    <div class="nav-fixed">
      <div
        v-for="(name, index) in sectionNames"
        :key="index"
        :class="{ active: activeSection === index }"
        class="nav-dot"
        @click="scrollToSection(index)"
      >
        <span class="tooltip">{{ name }}</span>
      </div>
    </div>

    <!-- 底部滚动提示 -->
    <div v-if="activeSection === 0" class="scroll-down">
      <span>向下滚动</span>
      <i class="fas fa-chevron-down"></i>
    </div>

    <!-- 页面计数器 -->
    <!--    <div class="page-counter">-->
    <!--      {{ activeSection + 1 }} / {{ sectionNames.length }}-->
    <!--    </div>-->
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useUserStore } from '@/stores/counter.js'
import fullpage from 'fullpage.js'
import Logo from '../assets/white.svg'


import WeatherCard from '@/components/WeatherCard.vue'
import HourlyWeather from '@/components/HourlyWeather.vue'
import DailyWeather from '@/components/DailyWeather.vue'
import LifeStyle from '@/components/LifeStyle.vue'
import { storeToRefs } from 'pinia'

const fullpageWrapper = ref(null)
const fullpageInstance = ref(null)
//初始页id
const activeSection = ref(0)
const header = ref(null)
const navMenu = ref(null)

const sectionNames = ['当前天气', '24小时预报', '七日预报', '生活指数']
const userStore = useUserStore()  // 获取 store 实例

const { currentLocation } = storeToRefs(userStore)



// 防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
}

// 初始化 fullpage.js
const initFullPage = () => {

  try {
    // noinspection JSPotentiallyInvalidConstructorUsage
    fullpageInstance.value = new fullpage(fullpageWrapper.value, {
      licenseKey: 'YOUR_FULLPAGE_LICENSE_KEY',
      scrollingSpeed: 700,
      parallax: false,
      scrollBar: false,
      css3: true,
      easing: 'easeInOutCubic',
      lazyLoading: true,
      lazyLoadEager: 1, // 预加载相邻部分
      observer: true,
      keyboardScrolling: true,
      responsiveWidth: 768,
      responsiveHeight: 600,
      afterLoad: (_, destination) => {
        activeSection.value = destination.index
        //记录当前session
        userStore.changeSession(destination.index)
        updateHeaderStyle()
      },
      onLeave: (_, destination) => {
        activeSection.value = destination.index
      }
    })

  } catch (error) {
    console.error('全屏滚动初始化失败:', error)
  }
}

// 滚动到指定部分
const scrollToSection = (index) => {
  if (!fullpageInstance.value) return
  if (index >= 0 && index < sectionNames.length) {
    fullpageInstance.value.moveTo(index + 1)
  }
}
// 更新头部样式
const updateHeaderStyle = debounce(() => {
  if (!header.value) return
  const shouldAddClass = window.scrollY > 50 || activeSection.value > 0
  // header.value.classList.toggle('scrolled', shouldAddClass)
}, 50)

// 切换移动端菜单
const toggleMobileMenu = () => {
  if (navMenu.value) {
    navMenu.value.classList.toggle('open')
  }
}

// 移除fullpage水印
const removeFullpageWatermark = () => {
  const watermark = document.querySelector('.fp-watermark')
  if (watermark) {
    watermark.style.display = 'none'
  }
}
//立即执行函数进行session的获取
(() => {
  const { currentSession } = JSON.parse(localStorage.getItem('user') || 0)
  activeSection.value = currentSession
})()
onMounted(() => {
  initFullPage()
  removeFullpageWatermark()
  window.addEventListener('scroll', updateHeaderStyle)
  updateHeaderStyle() // 初始化状态
})

onBeforeUnmount(() => {
  if (fullpageInstance.value) {
    try {
      fullpageInstance.value.destroy()
    } catch (e) {
      console.warn('全屏滚动销毁失败:', e)
    }
  }
  window.removeEventListener('scroll', updateHeaderStyle)
})
</script>

<style scoped>

.fullpage-container {
  position: relative;
  height: 100vh;
  width: 100vw;
}

.fullpage-wrapper {
  position: relative;
}
/* 添加背景图片样式 */
.fullpage-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/mountain.png'); /* 替换为你的图片路径 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  filter: brightness(0.7); /* 降低亮度使内容更清晰 */
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.default-content {
  max-width: 800px;
  padding: 30px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
}

.fp-overflow {
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 99vw;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  transition: all 0.4s ease;
}

.header.scrolled {
  background: rgba(15, 23, 42, 0.9);
  padding: 15px 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
}

.logo i {
  color: #4ade80;
  margin-right: 10px;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-menu a {
  cursor: pointer;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;
}

.nav-link:hover {
  color: #4ade80;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4ade80;
  transition: width 0.4s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.active {
  color: #4ade80;
}

.nav-link.active::after {
  width: 100%;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-fixed {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.nav-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  position: relative;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.nav-dot::after {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-dot:hover::after {
  opacity: 1;
}

.nav-dot.active {
  transform: scale(1.6);
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.3);
}

.nav-dot:hover {
  background: #4ade80;
  transform: scale(1.4);
}

.tooltip {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.nav-dot:hover .tooltip {
  opacity: 1;
  right: 40px;
}

.scroll-down {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-20px) translateX(-50%);
  }
  60% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.scroll-down i {
  font-size: 24px;
  margin-top: 5px;
}

/*
.page-counter {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(15, 23, 42, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 100;
}
*/
@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 40%;
    background: rgba(15, 23, 42, 0.95);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    transition: right 0.4s ease;
    z-index: 1000;
  }

  .nav-menu.open {
    right: 0;
  }

  .mobile-menu-btn {
    display: block;
    z-index: 1001;
  }

  .header {
    padding: 15px 20px;
  }

  .header.scrolled {
    padding: 10px 20px;
  }

  .nav-fixed {
    display: none;
  }

}
</style>

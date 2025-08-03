import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  //当前页数
  const currentSession = ref(0)
  const changeSession = (index) => {
    currentSession.value = isNaN(Number(index)) ? 0 : Number(index)
  }
  //地区信息
  const currentLocation = ref({
    name:'北京',
    id:'101010100'
  })
  const changeLocation = (index) => {
    currentLocation.value.name = index.name;
    currentLocation.value.id=index.id;
  }

  return { currentSession, changeSession, currentLocation,changeLocation }

}, {
  // 持久化配置
  persist: true
})

<template>
  <div class="location-search">
    <!-- 当前地区展示 -->

    <h1 class="current-location" @click="openSearchModal">
      当前地区<p>{{ currentLocation }}</p>
      <i class="qi-edit"></i>
    </h1>

    <!-- 搜索弹窗 -->
    <teleport to="body">
      <div v-if="showModal" class="location-modal">
        <div class="modal-mask" @click="closeModal"></div>

        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3>地区搜索</h3>
            <button class="close-btn" @click="closeModal">
              <i class="qi-close"></i>
            </button>
          </div>

          <!-- 搜索框 -->
          <div class="search-box">
            <input
              v-model="searchText"
              type="text"
              placeholder="输入城市/地区名称"
              @input="handleSearch"
            />
            <i class="qi-search"></i>
            <span v-if="isLoading" class="loading-indicator">
              <i class="qi-loading"></i>
            </span>
          </div>

          <!-- 搜索结果 -->
          <div
            v-if="searchResults.length > 0"
            class="search-results scrollable-area"
          >
            <h4 class="section-title">搜索结果</h4>
            <ul>
              <li
                v-for="item in searchResults"
                :key="item.id"
                @click="selectLocation(item)"
              >
                {{ formatLocationName(item) }}
              </li>
            </ul>
          </div>

          <!-- 无结果提示 -->
          <div
            v-else-if="searchText && !isLoading && searchResults.length === 0"
            class="no-results"
          >
            <i class="qi-map-marker-off"></i>
            <p>未找到"{{ searchText }}"相关地区</p>
            <p class="suggest">请尝试修改搜索关键词</p>
          </div>

          <!-- 搜索历史 -->
          <div
            v-if="searchHistory.length > 0 && !searchText"
            class="search-history scrollable-area"
          >
            <div class="section-header">
              <h4 class="section-title">最近搜索</h4>
              <button class="clear-btn" @click="clearHistory">清空</button>
            </div>
            <ul>
              <li
                v-for="(item, index) in searchHistory"
                :key="'history-'+index"
                @click="selectLocation(item)"
              >
                {{ formatLocationName(item) }}
                <button class="delete-btn" @click.stop="removeHistory(index)">
                  <i class="qi-delete"></i>
                </button>
              </li>
            </ul>
          </div>

          <!-- 初始空状态 -->
          <div
            v-if="showEmptyState"
            class="empty-state"
          >
            <i class="qi-map"></i>
            <p>输入城市或地区名称搜索</p>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash-es'
import { getLocation } from '@/apis/getLocation'

const props = defineProps({
  modelValue: {
    type: Object,
    default: { name:'北京',
    id:'101010100'}
  },
  maxHistory: {
    type: Number,
    default: 5
  },
  storageKey: {
    type: String,
    default: 'locationSearchHistory'
  },
})

const emit = defineEmits(['update:modelValue'])



const currentLocation = ref(props.modelValue.name);
const currentLocationId = ref(props.modelValue.id);
const showModal = ref(false)
const searchText = ref('')
const searchResults = ref([])
const searchHistory = ref([])
const isLoading = ref(false)

const showEmptyState = computed(() => {
  return !isLoading.value &&
    searchText.value === '' &&
    searchResults.value.length === 0 &&
    searchHistory.value.length === 0
})

// 初始化加载历史记录
onMounted(() => {
  loadHistory()
})

// 打开搜索弹窗
const openSearchModal = () => {
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  searchText.value = ''
  searchResults.value = []
}

// 加载搜索历史
const loadHistory = () => {
  const history = localStorage.getItem(props.storageKey)
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

// 保存搜索历史
const saveHistory = () => {
  localStorage.setItem(props.storageKey, JSON.stringify(searchHistory.value))
}

// 处理搜索输入
const handleSearch = () => {
  if (!searchText.value.trim()) {
    searchResults.value = []
    return
  }
  isLoading.value = true
  debouncedSearch()
}

// 防抖搜索
const debouncedSearch = debounce(async () => {
  try {
    const res = await getLocation(searchText.value)
    if (res.data?.code === '200') {
      searchResults.value = res.data.location
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}, 500)


// 格式化地区名称
const formatLocationName = (location) => {
  return `${location.name}${location.adm1 ? `, ${location.adm1}` : ''}`
}

// 选择地区
const selectLocation = (location) => {
  currentLocation.value = location.name
  currentLocationId.value = location.id
  emit('update:modelValue', location)
  addToHistory(location)
  closeModal()
}

// 添加到历史记录
const addToHistory = (location) => {
  // 移除重复项
  searchHistory.value = searchHistory.value.filter(
    item => item.id !== location.id
  )
  // 添加到开头
  searchHistory.value.unshift(location)
  // 限制数量
  if (searchHistory.value.length > props.maxHistory) {
    searchHistory.value = searchHistory.value.slice(0, props.maxHistory)
  }
  saveHistory()
}

// 删除单条历史记录
const removeHistory = (index) => {
  searchHistory.value.splice(index, 1)
  saveHistory()
}

// 清空历史记录
const clearHistory = () => {
  searchHistory.value = []
  saveHistory()
}
</script>

<style scoped>
.location-search {
  display: inline-block;
}
.cL{
  font-size: 40px;
  color: white;
  border-bottom: 1px dashed currentColor;
  padding-bottom: 4px;
}
.current-location {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 18px;
  color: #fff;
  transition: color 0.2s;
}
.current-location p{
  cursor: pointer;
  font-size: 38px;
  color: #fff;
  border-bottom: 1px dashed currentColor; /* 仅底部虚线 */
  padding-bottom: 4px;
}
.current-location:hover {
  color: #1890ff;
}

.current-location p:hover {
  color: #1890ff;
}

/* 弹窗样式 */
.location-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
}

.close-btn i {
  font-size: 20px;
}

.close-btn:hover {
  color: #333;
}

/* 搜索框 */
.search-box {
  position: relative;
  padding: 0 20px;
  margin: 16px 0;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.search-box i {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: #bfbfbf;
}

/* 搜索结果和搜索历史 */
.search-results,
.search-history {
  padding: 0 20px;
  overflow-y: scroll;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  margin: 0;
  font-size: 15px;
  color: #666;
  font-weight: normal;
}

.clear-btn {
  background: none;
  border: none;
  padding: 0;
  color: #1890ff;
  cursor: pointer;
  font-size: 13px;
}

.clear-btn:hover {
  opacity: 0.8;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 6px;
  overflow: hidden;
}

li {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li:last-child {
  border-bottom: none;
}

li:hover {
  background: #f5f5f5;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.delete-btn i {
  font-size: 16px;
}

/* 空状态 */
.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #bfbfbf;
}

.empty-state i {
  font-size: 40px;
  margin-bottom: 12px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
.scrollable-area {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 transparent;
}

.scrollable-area::-webkit-scrollbar {
  width: 6px;
}

.scrollable-area::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 3px;
}

.scrollable-area::-webkit-scrollbar-track {
  background: transparent;
}

/* 无结果提示 */
.no-results {
  padding: 30px 20px;
  text-align: center;
  color: #8c8c8c;
}

.no-results i {
  font-size: 40px;
  margin-bottom: 12px;
  display: block;
  color: #d9d9d9;
}

.no-results p {
  margin: 8px 0;
  font-size: 14px;
}

.no-results .suggest {
  font-size: 12px;
  color: #bfbfbf;
}

/* 加载指示器 */
.loading-indicator {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
}

.loading-indicator i {
  animation: spin 1s linear infinite;
  color: #1890ff;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 调整列表项样式 */
.search-results ul,
.search-history ul {
  max-height: inherit;
}

li {
  padding: 12px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 响应式设计 */
@media (max-width: 576px) {
  .modal-container {
    width: 95%;
  }

  .search-box,
  .search-results,
  .search-history {
    padding: 0 16px;
  }

  li {
    padding: 10px 16px;
  }
}
</style>

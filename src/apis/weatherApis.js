import { server } from '@/apis/server.js'

const defaultLocation = '101010100'
//location 为 城市id

// 发送请求，获取指定城市实时天气数据
export const getWeatherNow = async (_location) => {
  try {

    return await server.get('/now', {
      params: {
        location: _location || defaultLocation
      }
    })
  } catch (error) {
    console.error('城市实时天气数据请求错误:', error)
  }
}
//获取天气预报
export const getDailyWeather = async (_location) => {
  try {
    return await server.get('/daily', {
      params: {
        location: _location || defaultLocation
      }
    })
  }catch (error) {
    console.error('获取天气预报请求错误',error)
  }
}
// 获取每小时天气预报
export const getHourlyWeather = async (_location) => {
  try {
    return await server.get('/hourly', {
      params: {
        location: _location || defaultLocation
      }
    })
  }catch (error) {
    console.error('获取每小时天气预报请求错误',error)
  }
}
// 获取天气警报
export const getWeatherAlerts = async (_location) => {
  try {
    return await server.get('/alerts', {
      params: {
        location: _location || defaultLocation
      }
    })
  }catch (error) {
    console.error('获取天气警报请求错误',error)
  }
}
// 获取空气质量
export const getNowAirQuality = async (_location) => {
  try {
    return await server.get('/air', {
      params: {
        location: _location || defaultLocation
      }
    })
  }catch (error) {
    console.error('获取空气质量请求错误',error)
  }
}
// 获取天气指数预报
export const getWeatherIndexForecast = async (_location) => {
  try {
    return await server.get('/index', {
      params: {
        location: _location || defaultLocation
      }
    })
  }catch (error) {
    console.error('获取天气指数预报请求错误',error)
  }
}



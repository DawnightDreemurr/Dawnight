import { server } from '@/apis/server.js'
const defaultLocation = '长春市'
export const getLocation = async (_location) => {
  try {
    return await server.get('/location', {
      params: {
        location: _location || defaultLocation
      }
    })
  }catch (error) {
    console.error('获取天气警报请求错误',error)
  }
}

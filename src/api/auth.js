import request from '@utils/request'

export default {
  logIn(data, loading = true) {
    let url = '/social-shopping/api/platform/platform-login'
    return request.post(url, data, loading)
  },
  validate() {
    let url = '/social-shopping/api/platform/token-validate'
    return request.get(url)
  }
}

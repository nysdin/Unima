import axios from 'axios'

const http = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT
})

export default {
    request(method, url, options){
        var promise = null
        var params = {}
        var headers = {}

        if(options.params){
            //リクエストのパラメータをセット
            params = options.params
        }
        if(options.headers){
            headers = options.headers
        }
        //トークン認証が必要な場合Headersに情報を付加
        if(options.auth){
            const accessToken = localStorage.getItem('access-token')
            const uid = localStorage.getItem('uid')
            const client = localStorage.getItem('client')
            const authorizationHeader = { 'access-token': accessToken, 'uid': uid, 'client': client}
            headers = Object.assign(headers, authorizationHeader)
        }

        promise = http({
            method,
            url,
            data: params,
            headers,
        })
        return promise
    },
    get(url, options){
        return this.request('get', url, options)
    },
    post(url, options){
        return this.request('post', url, options)
    },
    patch(url, options){
        return this.request('patch', url, options)
    },
    delete(url, options){
        return this.request('delete', url, options)
    },
}
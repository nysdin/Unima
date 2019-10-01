import Vue from 'vue'
import ActionCable from 'actioncable'
import request from '../../utils/api'

const cable = {
    state: {
        cable: null,
        notificationChannel: null,
        notifications: [],
    },
    mutations: {
        connect(state, auth){
            const { token, uid, client } = auth
            const url = process.env.VUE_APP_WS_ENDPOINT + `/?access-token=${token}&uid=${uid}&client=${client}`
            const cable = ActionCable.createConsumer(url)
            state.cable = cable
            state.notificationChannel = cable.subscriptions.create('NotificationChannel', {
                connected(){
                    console.log('connected')
                },
                disconnected(){
                    console.log('disconnected')
                },
                received(data){
                    console.log(data)
                    state.notifications.unshift(data)
                }
            })
        },
        disconnect(state){
            if(state.notificationChannel){
                state.cable.subscriptions.consumer.disconnect()
                state.notificationChannel = null
                state.cable = null
                state.notifications = []
            }
        },
        setNotifications(state, data){
            state.notifications = data
        },
        sendNotification(state, data){
            const { recipientId, productId, action } = data
            state.notificationChannel.perform('notice', {
                recipient_id: recipientId,
                product_id: productId,
                action_type: action,
            })
        },
        check(state, ids){
            state.notifications.forEach( notification => {
                if(ids.includes(notification.id)){
                    notification.checked = true
                }
            })
        }
    },
    actions: {
        checkNotification({ commit }, ids){
            request.post('/api/v1/notifications/check', {
                params: { ids: ids },
                auth: true
            })
                .then(response => {
                    commit('check', ids)
                })
                .catch(error => {
                    console.log('error')
                })
        }
    }
}

export default cable
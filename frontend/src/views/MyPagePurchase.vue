<template>
    <div class="mypage-purchase">
        <v-sheet tile color="grey lighten-3" class="d-flex align-center justify-center" height="40">
            <div class="font-weight-bold">購入した商品</div>
        </v-sheet>
        <v-tabs grow v-model="activeTab">
            <v-tab class="mx-0" @click="trade">取引中</v-tab>
            <v-tab @click="close">取引終了</v-tab>
        </v-tabs>
        <Display :products="situatedProduct" />
    </div>
</template>

<script>
import Display from '../components/Display'
import request from '../utils/api.js'

export default {
    name: 'mypagePurchase',
    components: {
        Display
    },
    data(){
        return {
            activeTab: null,
            products: [],
            status: 'trade'
            
        }
    },
    computed: {
        //スクロールで情報を更新するなどしたい
        situatedProduct(){
            return this.products.filter(product => product.status === this.status)
        }
    },
    methods: {
        trade(){
            this.status = 'trade'
        },
        close(){
            this.status = 'close'
        }
    },
    created(){
        request.get('/api/v1/user/purchase', { auth: true })
            .then(response => {
                this.products = response.data
                const status = this.$route.query.status
                const conditions = ['trade', 'close']
                conditions.forEach( (element, index) => {
                    if(element === status){
                        this.status = status
                        this.activeTab = index
                    }
                })
            })
            .catch(error => console.log('error'))
    }
}
</script>

<style>

</style>

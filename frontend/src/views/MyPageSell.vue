<template>
    <div class="mypage-sell">
        <v-sheet tile color="grey lighten-3" class="d-flex align-center justify-center" height="40">
            <div class="font-weight-bold">出品した商品</div>
        </v-sheet>
        <v-tabs grow v-model="activeTab">
            <v-tab class="mx-0" @click="open">出品中</v-tab>
            <v-tab @click="trade">取引中</v-tab>
            <v-tab @click="close">取引終了</v-tab>
        </v-tabs>

        <Display :products="situatedProduct" />
    </div>
</template>

<script>
import Display from '../components/Display'
import request from '../utils/api.js'

export default {
    name: 'mypageSell',
    components: {
        Display
    },
    data(){
        return {
            activeTab: null,
            products: [],
            status: 'open'
            
        }
    },
    computed: {
        //スクロールで情報を更新するなどしたい 取引状態に応じた商品を返す
        situatedProduct(){
            return this.products.filter(product => product.status === this.status)
        }
    },
    methods: {
        open(){
            this.status = 'open'
        },
        trade(){
            this.status = 'trade'
        },
        close(){
            this.status = 'close'
        }
    },
    created(){
        request.get('/api/v1/user/sell', { auth: true })
            .then(response => {
                this.products = response.data
                const status = this.$route.query.status
                const conditions = ['open', 'trade', 'close']
                conditions.forEach( (element, index) => {
                    if(element === status){
                        this.status = status
                        this.activeTab = index
                    }
                })
            })
            .catch(error => console.log(error))
    },
    mounted(){
        
    }
}
</script>

<style>

</style>

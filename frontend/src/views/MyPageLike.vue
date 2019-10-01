<template>
    <div class="mypage-sell">
        <v-sheet tile color="grey lighten-3" class="d-flex align-center justify-center" height="40">
            <div class="font-weight-bold">いいねした商品</div>
        </v-sheet>
        <Display :products="situatedProduct" />

        <div class="d-flex justify-center">
            <v-pagination v-model="pagy.page"
                :length="pagy.pages"
                :total-visible="7"
                @next="nextPage"
                @previous="previousPage"
                @input="changePage"
                v-if="pagy.pages !== 1">
            </v-pagination>
        </div>
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
            products: [],
            pagy: {},
            status: 'open'
            
        }
    },
    computed: {
        //スクロールで情報を更新するなどしたい
        situatedProduct(){
            return this.products
        }
    },
    methods: {
        open(){
            console.log(this.situatedProduct)
            this.status = 'open'
        },
        trade(){
            this.status = 'trade'
        },
        close(){
            this.status = 'close'
        },
        nextPage(){
            request.get(this.pagy.next_url, {})
                .then(response => {
                console.log(response)
                this.products = response.data.products
                this.pagy = response.data.pagy
                })
                .catch(error => {
                console.log('error')
                })
        },
        previousPage(){
            request.get(this.pagy.prev_url, {})
                .then(response => {
                console.log(response)
                this.products = response.data.products
                this.pagy = response.data.pagy
                })
                .catch(error => {
                console.log('error')
                })
            console.log('previous')
        },
        changePage(page){
            const pageUrl = this.pagy.scaffold_url.replace(/__pagy_page__/, page)
            request.get(pageUrl, { auth: true })
                .then(response => {
                console.log(response)
                this.products = response.data.products
                this.pagy = response.data.pagy
                })
                .catch(error => {
                console.log('error')
                })
        }
    },
    created(){
        request.get('/api/v1/user/like', { auth: true })
            .then(response => {
                console.log(response.data)
                this.products = response.data.products
                this.pagy = response.data.pagy
            })
            .catch(error => console.log('error'))
    }
}
</script>

<style>

</style>

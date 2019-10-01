<template>
    <div id="search">
        <v-container fluid>
            <p class="ma-0"><span class="title mr-1">{{ $route.query.keyword }}</span>の検索結果</p>
        </v-container>

        <Display :products="products" />

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
import qs from 'qs'
import axios from 'axios'
import Display from '../components/Display'

export default {
    name: 'search',
    components: {
        Display,
    },
    data(){
        return {
            products: [],
            pagy: {},
        }
    },
    methods: {
        showProduct(id){
            this.$router.push({ path: `/product/${id}`})
        },
        nextPage(){
            let { keyword, min_price, max_price, state, category } = this.$route.query
            this.searchRequest(keyword, min_price, max_price, state, category, this.pagy.next)
        },
        previousPage(){
            let { keyword, min_price, max_price, state, category } = this.$route.query
            this.searchRequest(keyword, min_price, max_price, state, category, this.pagy.prev)
        },
        changePage(page){
            let { keyword, min_price, max_price, state, category } = this.$route.query
            this.searchRequest(keyword, min_price, max_price, state, category, page)
        },
        searchRequest(nameCont, priceGteq, priceLteq, stateEq, categoryNameCont, page){
            if(categoryNameCont === 'すべて') category = ''
            if(stateEq === 'すべて') state = ''

            if(!page) page = 1
            axios.get('/api/v1/products/search', {
                baseURL: process.env.VUE_APP_API_ENDPOINT,
                params:{
                    q: {
                        name_cont: nameCont,
                        price_gteq: priceGteq,
                        price_lteq: priceLteq,
                        state_eq: stateEq,
                        category_name_cont: categoryNameCont
                    },
                    page: page
                },
                paramsSerializer(params){
                    return qs.stringify(params, {arrayFormat: 'brackets'})
                }
            })
            .then(response => {
                console.log(response)
                this.products = response.data.products
                this.pagy = response.data.pagy
            })
            .catch(error => {
                console.log(error)
            })
        }
    },
    watch: {
        '$route' (to, from){
            let { keyword, min_price, max_price, state, category } = to.query
            this.searchRequest(keyword, min_price, max_price, state, category)
        }
    },
    mounted(){
        let { keyword, min_price, max_price, state, category } = this.$route.query
        this.searchRequest(keyword, min_price, max_price, state, category)
    }
}
</script>

<style>

</style>

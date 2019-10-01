<template>
    <div id="purchase-confirmation">
        <v-sheet tile color="grey lighten-3 d-flex align-center" height="30">
            <p class="font-weight-bold py-0 pl-3 ma-0">購入する商品の情報</p>
        </v-sheet>

            <v-row class="ma-0">
                <v-col :cols="3" class="pa-0">
                    <v-img :src="product.image" :aspect-ratio="1"></v-img>
                </v-col>
                <v-col :cols="9" class="pb-0">
                    <div class="d-flex flex-column justify-space-between">
                        <p class="font-weight-regular display-1">{{ product.name }}</p>
                        <p class="font-weight-bold mb-0">¥ {{ product.price }}</p>
                    </div>
                    
                </v-col>
            </v-row>
        
        <v-sheet tile color="grey lighten-3 d-flex align-center" height="30">
            <p class="font-weight-bold py-0 pl-3 ma-0">支払い方法</p>
        </v-sheet>
        <v-card :elevation="0">
            <v-card-text class="py-2">
                <template v-if="card.brand">
                    <div class="d-flex justify-space-between">
                        <div>
                            <p class="mb-1">{{ card.brand }}</p>
                            <p class="mb-1"> {{ card.last4 }}</p>
                            <p class="mb-1">{{ card.exp_month }} / {{ card.exp_year }}</p>
                        </div>
                        <div class="d-flex align-self-center flex-column">
                            <v-btn text small color="primary" class="inline-block"
                            @click="toCard">
                                変更
                            </v-btn>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="d-flex justify-center">
                        <v-btn outlined color="primary" @click="toCard">登録する</v-btn>
                    </div>
                </template>
            </v-card-text>
        </v-card>

        <v-sheet tile color="grey lighten-3 d-flex align-center" height="30">
            <p class="font-weight-bold py-0 pl-3 ma-0">支払い金額</p>
        </v-sheet>

        <v-card :elevation="0">
            <v-card-text>
                <div class="headline font-weight-bold">¥ {{ product.price }}</div>
            </v-card-text>
        </v-card>

        <v-container>
            <v-btn color="error" block samll :disabled="!card.brand" @click="purchase">購入する</v-btn>
        </v-container>
    </div>
</template>

<script>
import request from '../utils/api.js'

export default {
    name: 'PurchaseConfirmation',
    data(){
        return {
            product: {
                id: '',
                image: '',
                name: '',
                price: '',
                seller_id: '',
            },
            card: {
                barnd: '',
                last4: '',
                exp_month: '',
                exp_year: '',
            }
        }
    },
    methods: {
        purchase(){
            request.post(`api/v1/products/${this.$route.params.id}/trade`, { auth: true })
                .then(response => {
                    console.log('success')
                    const recipientId = this.product.seller_id
                    const productId = this.product.id
                    this.$store.commit('sendNotification', { recipientId, productId, action: 'purchase' })
                    this.$router.push(`/product/${this.product.id}/trade`, { auth: true })
                })
                .catch(error => {
                    console.log('error')
                })
        },
        toCard(){
            this.$router.push({ path: '/settings/card/create', query: { back: 'true' }})
        }
    },
    created(){
        request.get(`api/v1/products/${this.$route.params.id}/confirmation`, { auth: true })
            .then(response => {
                const product = response.data.product
                const card = response.data.card
                if(product.status === 'open'){
                    this.product.id = product.id
                    this.product.image = product.images[0].url
                    this.product.name = product.name
                    this.product.price = product.price
                    this.product.seller_id = product.seller_id
                    if(card){
                        this.card.brand = card.brand
                        this.card.last4 = '**** **** **** ' + card.last4
                        this.card.exp_month = card.exp_month
                        this.card.exp_year = card.exp_year
                    }
                }else{
                    this.$router.push('/')
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
}
</script>

<style>

</style>

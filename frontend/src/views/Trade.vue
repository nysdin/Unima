<template>
    <div id="show">
        <v-sheet tile>
            <v-container>
                <v-alert
                    border="left"
                    colored-border
                    type="error"
                    :elevation="1"
                    class="mb-0">
                    <span v-if="isSeller">購入者と取引連絡をし、商品の受け渡しを行ってください。</span>
                    <span v-else>
                        出品者と取引連絡をし、商品の受け渡しを行ってください。
                        商品の受け取りが完了した後、受け取りを完了するのボタンを押してください。
                    </span>
                </v-alert>
            </v-container>
        </v-sheet>

        <template v-if="isSeller">
            <v-sheet tile color="grey lighten-3" class="d-flex align-center" height="30">
                <v-container>
                    <p class="font-weight-bold py-0 ma-0">取引情報</p>
                </v-container>
            </v-sheet>
            <v-card tile flat>
                <v-container>
                    <v-row>
                        <v-col :cols="2">
                            <v-img 
                                aspect-ratio="1"
                                :src="product.images[0].url"
                                v-if="product.images">
                            </v-img>
                        </v-col>
                        <v-col :cols="10">
                            <div class="title font-weight-medium" style="cursor: initial!important;">{{ product.name }}</div>
                        </v-col>
                        <v-col >

                        </v-col>
                    </v-row>

                    <v-simple-table>
                        <tbody>
                            <tr>
                                <td>取引価格</td>
                                <td>{{ product.price }}</td>
                            </tr>
                        </tbody>
                    </v-simple-table>

                    <template v-if="product.status === 'trade'">
                        <v-btn color="error" block samll @click="finish" :disabled="loading" :loading="loading"
                            v-if="!isSeller">
                            受け取りを完了する
                        </v-btn>
                    </template>
                    <template v-else>
                        <v-btn color="error" block samll disabled>取引完了</v-btn>
                    </template>
                </v-container>
            </v-card>
        </template>

        <template v-else>
            <v-sheet tile color="grey lighten-3" class="d-flex align-center" height="30">
                <v-container>
                    <p class="font-weight-bold py-0 ma-0">購入品の情報</p>
                </v-container>
            </v-sheet>
            <v-card tile flat>
                <v-container>
                    <v-row>
                        <v-col :cols="3">
                            <v-img 
                                aspect-ratio="1"
                                :src="product.images[0].url"
                                v-if="product.images">
                            </v-img>
                        </v-col>
                        <v-col :cols="9" class="d-flex flex-column justify-space-between">
                            <div class="headline font-weight-medium">{{ product.name }}</div>
                            <div class="font-weight-bold">¥ {{ product.price }}</div>
                        </v-col>
                    </v-row>

                    <template v-if="product.status === 'trade'">
                        <v-btn color="error" block samll @click="finish" :disabled="loading" :loading="loading"
                            v-if="!isSeller">
                            受け取りを完了する
                        </v-btn>
                    </template>
                    <template v-else>
                        <v-btn color="error" block samll disabled>取引完了</v-btn>
                    </template>
                </v-container>
            </v-card>
        </template>

        <div class="text-center pb-2">
            <a @click="cancelDialog = true">取引をキャンセルする</a>
        </div>

        <v-dialog v-model="cancelDialog">
            <v-card>
                <v-card-title>
                    <p class="text-center ma-0" style="width:100%;">取引のキャンセル</p>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <div class="text-center" style="width: 100%;">
                        <p class="ma-0 subtitle-1">
                            取引のキャンセルができる回数は<br/>毎月５回までです。
                        </p>
                        <span class="body-2">
                            ※今月の残り回数は<span style="color: red;">{{ cancelCount }}回</span><br>
                            <span v-if="!canBeCanceled">
                                今月のキャンセル回数が上限を満たしています.<br>
                                正当な理由でキャンセルを望む場合は<br>下記ボタンより運営にお問い合わせください.
                            </span>
                        </span>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="d-flex justify-center" style="width:100%;">
                        <template v-if="canBeCanceled">
                            <v-btn color="blue darken-1" text @click="cancelDialog = false">閉じる</v-btn>
                            <v-btn color="error" text @click="cancelTrade">取引をキャンセルする</v-btn>
                        </template>
                        <template v-else>
                            <v-btn color="blue darken-1" text　@click="sendCancelRequest">キャンセルを申し込む</v-btn>
                        </template>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card tile flat>
            <v-sheet tile color="grey lighten-3" class="d-flex align-center" height="30">
                <v-container>
                    <p class="font-weight-bold py-0 ma-0">出品者</p>
                </v-container>
            </v-sheet>
            <v-list class="pa-0" flat>
                    <v-list-item @click="$router.push('/mypage')">
                        <v-list-item-avatar>
                            <v-img :src="product.seller.avatar.url"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title v-text="product.seller.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
            </v-list>
        </v-card>

        <v-card tile flat>
            <v-container>
                <v-card :elevation="0" v-for="message in messages" :key="message.id">
                    <v-row>
                        <v-col :cols="2">
                            <v-avatar :size="40" class="mt-4">
                                <img :src="message.user.avatar.url" alt="avatar">
                            </v-avatar>
                        </v-col>
                        <v-col :cols="10" class="pl-0">
                            <p class="mb-1">{{ message.user.name }}</p>
                            <v-sheet class="grey lighten-3 pa-2 message">
                                {{ message.content }}
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
                <v-textarea v-model="content" outlined placeholder="取引に関する連絡を取ろう！"></v-textarea>

                <v-btn color="error" block samll :disabled="product.status === 'close'" @click="comment">取引連絡をする</v-btn>
                
            </v-container>
        </v-card>
    </div>
</template>

<script>
import request from '../utils/api.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Trade',
    data(){
        return {
            loading: false,
            isHidden: true,
            cancelDialog: false,
            product: {
                seller: {
                    name: '',
                    avatar: { url: '' }
                },
                category:{
                    name:'',
                    path: []
                }
            },
            liked: false,
            messages: [],
            //commentの内容
            content: '',
            //breadcrumbsリスト用の配列
            category: []
        }
    },
    computed: {
        ...mapGetters('user', ['cancelCount']),
        favoriteColor(){
            return this.liked ? 'red' : 'grey'
        },
        categories(){
            const categories = []
            this.product.category.path.forEach(c => {
                categories.push({ text: c.name })
            })
            return categories
        },
        isSeller(){
            return this.product.seller_id === this.$store.state.user.user.id
        },
        canBeCanceled(){
            return this.cancelCount > 0
        }
    },
    created(){
        //商品情報を取得
        this.$store.commit('auth/apiRequest')
        request.get(`/api/v1/products/${this.$route.params.id}/trade`, { auth: true })
            .then( response => {
                console.log(response)
                const product = response.data.product
                if(product.images.length === 1){
                    this.isHidden = false
                }
                const user_id = this.$store.state.user.user.id
                if(user_id === product.buyer_id || user_id === product.seller_id){
                    this.product = product
                    this.liked = response.data.like
                    this.messages = response.data.messages
                    this.$store.commit('auth/apiCompleted')
                }else{
                    this.$router.push('/')
                    this.$store.commit('auth/apiCompleted')
                }
            })
            .catch( error => {
                this.$router.push('/')
                this.$store.commit('auth/apiCompleted')
                console.log('error')
            })
    },
    methods: {
        finish(){
            this.loading = true
            request.post(`/api/v1/products/${this.product.id}/complete`, { auth: true })
                .then(response => {
                    this.loading = false
                    this.product.status = "close"
                })
                .catch( error => {
                    this.loading = false
                    console.log('error')
                })
        },
        comment(){
            request.post(`/api/v1/products/${this.product.id}/trade_messages`, { auth: true, params: { content: this.content} })
                .then( response => {
                    this.content = ''
                    this.messages.push(response.data.message)
                })
                .catch(error => {
                    console.log('error comment')
                })
        },
        cancelTrade(){
            if(this.cancelCount === 0) return
            request.post(`/api/v1/products/${this.product.id}/cancel`, { auth: true })
                .then(response => {
                    this.$store.commit('user/reduceCancelCount')
                    this.$router.push(`/product/${this.product.id}`)
                })
                .catch(error => {
                    console.log('error')
                })
            this.cancelDialog = false
        },
        sendCancelRequest(){
            console.log('send')
        }
    }
}
</script>

<style>
.product-toolbar{
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
}

.messages{
    border-radius: 10px;
}

.messages:after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 3px; 
    left: -19px;
    border: 8px solid transparent;
    border-right: 18px solid #edf1ee;
    -webkit-transform: rotate(35deg);
    transform: rotate(35deg);
}
</style>

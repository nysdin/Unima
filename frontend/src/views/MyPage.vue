<template>
    <div id="mypage">
        <v-container class="py-0">
            <v-row>
                <v-col :cols="3">
                    <v-avatar :size="80">
                        <img :src="avatarUrl">
                    </v-avatar>

                </v-col>
                <v-col :cols="9">
                    <p class="mt-2 subtitle-1 font-weight-bold">{{ name }}</p>
                    <router-link :to="`/u/${$store.state.user.user.id}`">プロフィールを見る</router-link>
                </v-col>
            </v-row>
        </v-container>

        <v-list>
            <v-subheader>商品</v-subheader>
            <v-list-group v-for="product in products" :key="product.title" no-action>
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title v-text="product.title"></v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item v-for="subItem in product.items" :key="subItem.title" @click="toProduct(subItem.status, product.url)">
                    <v-list-item-content>
                        <v-list-item-title v-text="subItem.title"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>
            <v-list-item @click="$router.push('/mypage/like')">
                <v-list-item-title>いいねした商品</v-list-item-title>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <v-subheader>設定</v-subheader>
            <v-list-item-group>
                <v-list-item @click="$router.push('/password/edit')">
                    <v-list-item-content>
                        <v-list-item-title v-text="'パスワードの再設定'"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="$router.push('/settings/bank')">
                    <v-list-item-content>
                        <v-list-item-title v-text="'銀行口座の登録'"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="$router.push('/settings/card')">
                    <v-list-item-content>
                        <v-list-item-title v-text="'お支払い方法'"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>

        <v-container>
            <v-btn block @click="logout" 
                class="mt-2" color="error"
                :loading="loading" :disabled="loading">
                ログアウト
            </v-btn>
        </v-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '../utils/api.js'
export default {
    name: 'mypage',
    data(){
        return {
            loading: false,
            password: '',
            password_confirmation: '',
            products: [
                {
                    title: '出品した商品',
                    url: 'sell',
                    items: [
                        { title: '出品中の商品', status: 'open' },
                        { title: '取引中の商品', status: 'trade' },
                        { title: '終了した商品', status: 'close' }
                    ]
                },
                {
                    title: '購入した商品',
                    url: 'purchase',
                    items: [
                        { title: '取引中の商品', status: 'trade' },
                        { title: '終了した商品', status: 'close' }
                    ]
                }
            ]
        }
    },
    computed: {
        ...mapGetters('user', ['name', 'email', 'avatar']),
        avatarUrl(){
            if(this.avatar.url){
                return this.avatar.url
            }else{
                return ''
            }
        }
    },
    methods: {
        passwordReset(){
            request.patch('/api/v1/auth/password', { params: {
                    password: this.password,
                    password_confirmation: this.password_confirmation
                }, auth: true })
                .then(response => console.log(response))
                .catch(error => console.log(error.response.data))
        },
        editUser(){
            this.$router.push('/u/edit')
        },
        toProduct(status, url){
            this.$router.push({ path: `/mypage/${url}`, query: { status: status }})
        },
        logout(){
            this.loading = true
            this.$store.dispatch('auth/logout')
                .then(() => {
                    this.loading = false
                    this.$router.push('/login')
                })
                .catch(() => {
                    this.loading = false
                    console.log('sign out failed')
                })
        }
    }
}
</script>

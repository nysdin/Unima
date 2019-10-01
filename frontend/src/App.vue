<template>
    <div id="app">
        <v-app>
            <v-app-bar elevate-on-scroll fixed>
                    <v-toolbar-title class="title px-0" @click="toTop">Unima</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="mr-1" :key="1">
                        <v-icon @click="searched = true">search</v-icon>
                    </v-btn>
                    <v-btn icon class="mr-1" v-if="isLoggedIn">
                        <v-icon @click="$router.push('/sell')">mdi-camera-plus</v-icon>
                    </v-btn>
                    <v-menu offset-y v-if="isLoggedIn">
                        <template v-slot:activator="{ on }">
                            <v-btn icon class="mr-1" v-on="on" @click="checkNotification">
                                <v-badge overlap color="red">
                                    <template v-slot:badge>
                                        <span v-if="checkedNumber">{{ checkedNumber }}</span>
                                    </template>
                                    <v-icon>mdi-bell</v-icon>
                                </v-badge>
                            </v-btn>
                        </template>
                        <template v-if="notifications.length">
                            <v-list class="menu-scroll pa-0">
                                <v-list-item
                                    v-for="notice in notifications"
                                    :key="notice.id"
                                    @click="goPage(notice)">
                                    <v-list-item-avatar tile :size="48">
                                        <v-img :src="notice.product.images[0].url"></v-img>
                                    </v-list-item-avatar>
                                    <v-list-item-content v-if="notice.action === 'comment'">
                                        <p class="ma-0 notification-text">{{ notice.sender.name }}さんが「{{ notice.product.name }}」にコメントをしました。</p>
                                        <span class="caption font-weight-thin">
                                            {{ $moment(notice.created_at, 'YYYY-MM-DDTHH:mm:ssZ').fromNow() }}
                                        </span>
                                    </v-list-item-content>
                                    <v-list-item-content v-if="notice.action === 'purchase'">
                                        <p class="ma-0">
                                            「{{ notice.product.name }}」が{{ notice.sender.name }}さんに
                                            購入されました。
                                        </p>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </template>
                        <template v-else>
                            <div class="empty-notification d-flex justify-center align-center">
                                <p>現在、通知はありません</p>
                            </div>
                        </template>
                    </v-menu>
                    <v-btn icon @click="$router.push('/mypage')" v-if="isLoggedIn">
                        <v-avatar :size="42">
                            <v-img :src="$store.state.user.user.avatar.url" class="avatar"></v-img>
                        </v-avatar>
                    </v-btn>
                    <v-btn v-if="!isLoggedIn" x-small :elevation="0" 
                    class="mr-1" outlined :minHeight="30"
                    @click="$router.push('/register')">新規登録</v-btn>
                    <v-btn v-if="!isLoggedIn" x-small :elevation="0" 
                    outlined :minHeight="30" @click="$router.push('/login')">ログイン</v-btn>
            </v-app-bar>

            <div class="init-loading" v-if="!initialized">
                <v-container fill-height>
                    <v-layout row justify-center align-center>
                        <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
                    </v-layout>
                </v-container>
            </div>

            <router-view class="main" v-if="initialized"/>
        </v-app>

        <v-dialog v-model="searched" scrollable>
            <v-card>
                <v-card-title>商品を検索</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" class="pa-0">
                                <v-text-field outlined label="キーワード" v-model="keyword" clearable></v-text-field>
                            </v-col>
                            <v-col cols="12" class="pa-0">
                                <v-select outlined :items="categoris" label="カテゴリー" v-model="category"></v-select>
                            </v-col>
                            <v-col cols="12" class="pa-0">
                                <v-select outlined :items="states" label="商品の状態" v-model="state"></v-select>
                            </v-col>
                            <v-col cols="5" class="pa-0">
                                <v-text-field outlined label="最小価格" v-model="minPrice" clearable></v-text-field>
                            </v-col>
                            <v-col cols="2" class="pa-0 justify-center align-center d-flex">
                                <p>〜</p>
                            </v-col>
                            <v-col cols="5" class="pa-0">
                                <v-text-field outlined label="最大価格" v-model="maxPrice" clearable></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="blue darken-1" text @click="searched = false">キャンセル</v-btn>
                    <v-btn color="blue darken-1" text @click="search">検索する</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

            <!-- <v-navigation-drawer v-model="drawer" fixed temporary class="side-nav overflow-hidden">
                <template v-if="isLoggedIn">
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-img :src="$store.state.user.user.avatar.url" class="avatar"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{$store.state.user.user.name}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <template v-else>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>Unima</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>

                <v-divider></v-divider>

                <v-list dense>
                    <v-list-item v-for="menu in menus" :key="menu.title" link @click="toLink(menu.url)">
                    <v-list-item-icon>
                        <v-icon>{{ menu.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ menu.title }}</v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                </v-list>

                <template v-slot:append v-if="isLoggedIn"> 
                    <div class="pa-2">
                        <v-btn block :elevation="2" @click="logout">Logout</v-btn>
                    </div>
                </template>

            </v-navigation-drawer> -->
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
    data(){
        return {
            searched: false,
            keyword: '',
            category: '',
            state: '',
            minPrice: null,
            maxPrice: null,
            categoris: [ 'すべて', '一般', '文系', '理系'],
            states: ['すべて', '新品、未使用', '目立った傷や汚れなし', 'やや傷れや汚れあり', '全体的に状態が悪い'],
        }
    },
    computed: {
        ...mapState({
            notifications: state => state.cable.notifications
        }),
        initialized(){
            return this.$store.getters['auth/init']
        },
        loading(){
            return this.$store.getters['auth/loading']
        },
        isLoggedIn(){
            return !!this.$store.state.auth.token
        },
        checkedNumber(){
            let number = 0
            this.notifications.forEach( notice => {
                if(!notice.checked) number++
            })
            return number
        }
    },
    created(){
        this.$store.dispatch('auth/initialize', localStorage.getItem('access-token'))
    },
    methods: {
        toTop(){
            this.$router.push('/')
        },
        search(){
            this.$router.push({
                path: '/search',
                query: {
                    keyword: this.keyword,
                    category: this.category,
                    state: this.state,
                    min_price: this.minPrice,
                    max_price: this.maxPrice
                }
            })
            this.searched = false
        },
        goPage(notice){
            const id = notice.product.id
            if(notice.action === 'comment'){
                this.$router.push(`/product/${id}`)
            }else if(notice.action === 'purchase'){
                this.$router.push(`/product/${id}/trade`)
            }
        },
        checkNotification(){
            if(this.checkedNumber){
                const ids = []
                this.notifications.forEach(notice => {
                    if(!notice.checked){
                        ids.push(notice.id)
                    }
                })
                this.$store.dispatch('checkNotification', ids)
            }
        }
    },
}
</script>


<style>
#app {
    color: #2c3e50;
}

.title{
    cursor: pointer;
}

.main{
    margin-top: 56px;
}

.navbar{
    position: fixed!important;
    z-index: 1;
}

.avatar{
    border: 2px solid #b9b9b9;
}

.side-nav{
    z-index: 20;
}

.overflow-y-hidden{
    overflow-y: hidden;
}

.init-loading{
    overflow-y: hidden;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
}

.notification-text{
    line-height: 1.3!important;
}

.empty-notification{
    background-color: rgb(252, 252, 252);
    width: 200px;
    height: 200px;
}

.menu-scroll{
    height: 300px;
    overflow: auto;
}
</style>

<template>
    <div id="login-container">
        <h1 class="text-center">ログイン</h1>
        <v-container>
            <v-form>
                <v-text-field v-model="user.email" label="メールアドレス" 
                    placeholder="test@example.com" required clearable></v-text-field>
                <v-text-field v-model="user.password" :append-icon="show ? 'visibility' : 'visibility_off'"
                label="パスワード" required :type="show ? 'text' : 'password'"
                @click:append="show = !show"></v-text-field>

                <v-btn medium outlined @click="login" color="primary"
                    :loading="loading" :disabled="loading">
                    ログイン
                </v-btn>
                <v-btn small text color="primary" class="ml-2"
                    @click="$router.push('/password_reset')">
                    パスワードを忘れた方はこちら
                </v-btn>
            </v-form>
        </v-container>
    </div>
</template>

<script>
import request from '../utils/api.js'

export default {
    name: 'login',
    data() {
        return {
            show: false,
            user: { email: 'yamada@example.com', password: 'password'},
            loading: false,
        }
    },
    methods: {
        login(){
            this.loading = true
            this.$store.dispatch('auth/login', this.user)
                .then( () => {
                    this.loading =false
                    this.$router.push('/')
                })
                .catch( errors => {
                    this.loading =false
                    console.log(errors)
                })
        },
        toResetPassword(){
            console.log('ok')
            this.$router.push('/password/edit')
            console.log('no')
        },
    },
    
}
</script>
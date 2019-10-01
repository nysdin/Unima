<template>
    <div id="password-reset">
        <v-container>
            <v-card flat>
                <v-card-title>
                    <span class="subtitle-1">パスワード変更用メールアドレス</span>
                </v-card-title>
                <v-card-text>
                    <ValidationObserver v-slot="{ invalid }">
                        <v-form ref="forms">
                            <ValidationProvider name="ニックネーム" rules="required|email" v-slot="{ errors, valid }">
                                <v-text-field v-model="email" 
                                    label="メールアドレス" @click:append="show1 = !show1"
                                    :success="valid" :error-messages="errors">
                                </v-text-field>
                            </ValidationProvider>
                            <div class="d-flex justify-center">
                                <v-btn medium outlined 
                                    color="primary" @click="sendEmail"
                                    :loading="loading" :disabled="loading || invalid">
                                    送信する
                                </v-btn>
                            </div>
                        </v-form>
                    </ValidationObserver>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import request from '../utils/api.js'
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
    name: 'passwordReset',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data(){
        return {
            email: '',
            loading: false,
        }
    },
    methods: {
        sendEmail(){
            this.loading = true
            request.post('/api/v1/auth/password', {
                params: {
                    email: this.email,
                    redirect_url: process.env.VUE_APP_CLIENT_URL + '/password/edit'
                }
            })
            .then( () => {
                this.loading = false
                console.log('success')
            })
            .catch( () => {
                this.loading = false
                console.log('failed')
            })
        },
    }
}
</script>

<template>
    <div id="password-edit">
        <v-container>   
            <v-card flat>
                <v-card-title>
                    パスワード変更
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <ValidationObserver v-slot="{ invalid }">
                        <v-form ref="forms">
                            <ValidationProvider name="パスワード" rules="required|min:6" v-slot="{ errors, valid }">
                                <v-text-field v-model="password" @click:append="show1 = !show1"
                                    :append-icon="show1 ? 'visibility' : 'visibility_off'"
                                    placeholder="6文字以上"
                                    :type="show1 ? 'text' : 'password'" label="パスワード" 
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider rules="required|password:パスワード" v-slot="{ errors, valid }">
                                <v-text-field v-model="passwordConfirmation" 
                                    :append-icon="show2 ? 'visibility' : 'visibility_off'"
                                    :type="show2 ? 'text' : 'password'" placeholder="6文字以上"
                                    label="パスワード(確認)" @click:append="show2 = !show2"
                                    :error-messages="errors" :success="valid">
                                </v-text-field>
                            </ValidationProvider>

                            <div class="d-flex justify-center">
                                <v-btn outlined medium color="primary"
                                    @click="resetPassword"
                                    :loading="loading" :disabled="loading || invalid">
                                    変更する
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
    name: 'passwordEdit',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data(){
        return {
            password: '',
            passwordConfirmation: '', 
            show1: false, 
            show2: false,
            loading: false,
        }
    },
    methods: {
        resetPassword(){
            this.loading = true
            const auth = true
            const params = {
                password: this.password,
                password_confirmation: this.passwordConfirmation,
            }
            const headers = {}
            if(this.$route.query.token){
                auth = false
                const query = this.$route.query
                headers['access-token'] = query.token
                headers['client'] = query.client
                headers['uid'] = query.uid
            }
            request.patch('api/v1/auth/password', {
                auth,
                params,
                headers
            })
            .then(response => {
                this.loading = false
                console.log('success')
                this.$router.push('/mypage')
            })
            .catch(error => {
                this.loading = false
                console.log('error')
            })
        }
    },
}
</script>

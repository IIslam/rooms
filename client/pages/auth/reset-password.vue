<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-form lazy-validation >

                       <v-text-field
                          v-model="form.password"
                          append-icon="lock"
                          name="password"
                          :counter="32"
                          type='password'
                          v-validate="'required|max:32|min:8'"
                          :error-messages="errors.collect('password')"
                          label="enter a real good password, that you can remember."
                        ref="password"
                          required
                        >
                            
                        </v-text-field>
                        <v-text-field
                          v-model="form.password_confirmation"
                          name="password_confirmation"
                          append-icon="lock"
                          :counter="32"
                          type='password'
                          v-validate="'required|confirmed:password'"
                          :error-messages="errors.collect('password_confirmation')"
                          label="hit it one more to double check."
                           data-vv-as="password"
                          required
                        >
                            
                        </v-text-field>


                      <v-btn
                        @click.prevent="submit"
                        color="success"
                        :disabled="errors.any() || !isCompleted"
                      >
                        Reset Password
                       <span style="padding-left: 3px">
                          <v-icon>update</v-icon>
                        </span>
                      </v-btn>
                  </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    middleware: ['guest', 'has-reset-token'],
    data () {
        return {
          form : {
            password : null,
            password_confirmation:  null
          }
        }
    },
    computed: {
      isCompleted() {
        return this.form.password && this.form.password_confirmation
      }
    },
    methods : {
      ...mapActions('auth', [
        'resetPassword'
      ]),
      submit(){
        this.resetPassword({
          form: this.form,
          token: this.$route.query.token
        }).then(() => {
          this.$router.push({
              name :'index'
          })
        })
      }
    }
  }
</script>

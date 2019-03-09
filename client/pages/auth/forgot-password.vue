<template>
  <v-content>
      <v-container fluid fill-height>
          <v-layout align-center justify-center>
              <v-flex xs12 sm8 md4>
                  <v-form lazy-validation >

                    <v-text-field
                      v-model="form.email"
                      append-icon="alternate_email"
                      v-validate="'required|email'"
                      :error-messages="errors.collect('email')"
                      type='email'
                      label="E-mail"
                      data-vv-name="email"
                      required
                    >
                        
                    </v-text-field>
                    <v-btn
                      @click.prevent="submit"
                      color="success"
                      :disabled="errors.any() || !isCompleted"
                    >
                      Send me token
                     <span style="padding-left: 3px">
                        <v-icon>send</v-icon>
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
    middleware: 'guest',
    data () {
        return {
          form : {
            email : null
          }
        }
    },
    computed: {
      isCompleted() {
        return this.form.email
      }
    },
   methods : {
      ...mapActions('auth', [
        'forgotPassword'
      ]),

      submit(){
        this.forgotPassword(this.form)
      }
    }
  }
</script>

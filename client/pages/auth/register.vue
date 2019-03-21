<template>
    <v-content>
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-form lazy-validation >

                        <v-text-field
                          v-model="form.name"
                          v-validate="'required|max:10'"
                          :counter="10"
                          :error-messages="errors.collect('name')"
                          label="Name"
                          data-vv-name="name"
                          append-icon="perm_identity"
                          required
                        >
                        </v-text-field>

                        <v-text-field
                          v-model="form.email"
                          append-icon="alternate_email"
                          v-validate="'required|email'"
                          :error-messages="errors.collect('email')"

                          label="E-mail"
                          data-vv-name="email"
                          required
                        >
                            
                        </v-text-field>
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
                          color="success"
                          @click.prevent="register"
                          :disabled="errors.any() || !isCompleted"
                        >
                          Register.
                        </v-btn >
                        <nuxt-link :to="{name: 'auth-login'}" class="text-sm-left">Login instead?</nuxt-link> 
                  </v-form>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>
<script>
export default {
  middleware: 'guest',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  computed: {
    isCompleted() {
      return (
        this.form.name &&
        this.form.email &&
        this.form.password_confirmation &&
        this.form.password
      )
    }
  },
  methods: {
    async register() {
      await this.$axios.post('/user/register', this.form)
      this.$router.push({
        name: 'index'
      })
    }
  }
}
</script>

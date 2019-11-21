<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form lazy-validation>
            <v-text-field
              v-model="form.email"
              append-icon="alternate_email"
              v-validate="'required|email'"
              :error-messages="errors.collect('email')"
              type="email"
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
              type="password"
              v-validate="'required|max:32|min:8'"
              :error-messages="errors.collect('password')"
              label="enter your password."
              ref="password"
              required
            >
            </v-text-field>

            <v-btn
              @click.prevent="login"
              color="success"
              :disabled="errors.any() || !isCompleted"
            >
              Login
              <span style="padding-left: 3px">
                <v-icon>lock_open</v-icon>
              </span>
            </v-btn>
            <nuxt-link
              :to="{ name: 'auth-forgot-password' }"
              class="text-sm-left"
              >Forgot your password ?</nuxt-link
            >
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
        email: '',
        password: ''
      }
    }
  },
  computed: {
    isCompleted() {
      return this.form.email && this.form.password
    }
  },
  methods: {
    login() {
      this.$auth
        .login({
          data: this.form
        })
        .then(() => {
          this.$route.push({
            name: 'index'
          })
        })
    }
  }
}
</script>

<template>
  <div>


    <ValidationObserver v-slot="{handleSubmit}" ref="observer">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <ValidationProvider v-slot="{ errors }"
                            name="Name"
                            rules="required|min:5"
                            v-if="mode==='register'"
        >


          <b-field label="Username"
                   :type="{ 'is-danger': errors.length > 0 }"
                   :message="  errors.length > 0 ? errors[0] : '' "
          >
            <b-input maxlength="30" v-model="name" key="name-input"></b-input>
          </b-field>


        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }"
                            name="Email"
                            rules="required|email"
        >
          <b-field label="Email"
                   :type="{ 'is-danger': errors.length > 0 }"
                   :message="  errors.length > 0 ? errors[0] : '' ">
            <b-input v-model="email" maxlength="50" type="text" key="email-input"></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider name="Password" v-slot="{ errors }" rules="required|min:8">
          <b-field label="Password"
                   :type="{ 'is-danger': errors.length > 0 }"
                   :message="  errors.length > 0 ? errors[0] : '' ">
            <b-input v-model="password" type="password" maxlength="30" key="password-input" password-reveal></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider name="confirm" v-slot="{ errors }" rules="required|password:@Password"
                            v-if="mode==='register'">
          <b-field label="Confirm Password"
                   :type="{ 'is-danger': errors.length > 0 }"
                   :message="  errors.length > 0 ? errors[0] : '' ">
            <b-input v-model="confirmPassword" type="password" maxlength="30" key="confirm-password-input"
                     password-reveal></b-input>
          </b-field>
        </ValidationProvider>


        <div class="buttons">
          <b-button type="is-primary" native-type="submit" expanded>{{
              mode === 'login' ? 'Login' : 'Register'
            }}
          </b-button>
        </div>
      </form>
    </ValidationObserver>


  </div>


</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider
  },
  props: {
    mode: String
  },
  watch: {
    mode(val, oldVal) {
      this.resetForm()
    }
  },
  data() {
    return {
      name: null,
      email: "test123@mailinator.com",
      password: "nicho1234",
      confirmPassword: null,
    }
  },
  methods: {
    resetForm() {
      this.name = null
      this.email = null
      this.password = null
      this.confirmPassword = null
      // You should call it on the next frame
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    async onSubmit() {
      // Login
      if (this.mode === "login") {
        await this.login();
      } else {
        // Register
        await this.register();
      }
    },
    async login() {
      try {

        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })


      } catch (e) {

      }
    },
    async register() {
      try {

        await this.$axios.post('/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })

        //* Automatic Log in
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
      } catch (e) {

      }
    }
  }
}
</script>


<style scoped>

</style>

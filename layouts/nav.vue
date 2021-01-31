<template>
  <div>
    <b-navbar fixed-top type="is-primary">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          >
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item href="#">
          Home
        </b-navbar-item>
        <b-navbar-item href="#">
          Documentation
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
          <b-navbar-item href="#">
            About
          </b-navbar-item>
          <b-navbar-item href="#">
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <div class="buttons">

            <b-button type="is-danger" @click="logOut()">
               Log Out
            </b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <Nuxt/>
  </div>

</template>

<script>
export default  {
  methods : {
    async logOut(){

      await this.$auth.logout()
    }
  }
}
</script>

<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/static"
        >
          <img
            src="~assets/buefy.png"
            alt="Buefy"
            height="28"
          >
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
        <p class="menu-label is-hidden-touch">
          General
        </p>
        <ul class="menu-list">
          <li
            v-for="(item, key) of items"
            :key="key"
          >
            <nuxt-link
              :to="item.to"
              exact-active-class="is-active"
            >

              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
        <ul>
          <b-button @click="logOut">Log out</b-button>
        </ul>
      </aside>

      <div class="container column is-10">
        <Nuxt/>
      </div>

    </section>
  </div>
</template>

<script>
export default {

  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'dashboard' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'dashboard-inspire' }
        }
      ]
    }
  },
  methods : {
   async logOut(){
     console.log("logout triggered");
     console.log(this.$auth);
      await this.$auth.logout()
    }
  }
}
</script>

<template>

    <section class="main-content columns" style="margin-top: 4px">
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
      </aside>

      <div class="container column is-10">
        <Nuxt/>
      </div>

    </section>

</template>

<script>
export default {
  layout : 'nav',
  data () {
    return {
      items: [
        {
          title: 'Projects',
          icon: 'folder',
          to: { name: 'dashboard' }
        },
        {
          title: 'Containers',
          icon: 'cube',
          to: { name: 'dashboard-containers' }
        }
      ]
    }
  },
}
</script>

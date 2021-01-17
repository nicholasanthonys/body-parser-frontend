<template>
  <section class="section">
    <div v-if="isLoading">
      <b-loading :is-full-page="isFullPageLoading" :active="isLoading"  ></b-loading>
    </div>


    <masonry
      :cols="{default: 3, 1000: 2, 700: 1, 400: 1}"
      :gutter="{default: '30px', 700: '15px'}"
      v-else
    >
      <div v-for="project in projects" :key="project._id" style="padding: 10px">
        <card
          :title="project.name"
          icon="folder"

        >
          <template v-slot:card-content v-if="project.description">


            <div>
              <span class="has-text-weight-semibold"> Project Slug : </span>
              <p class="dont-break-out">{{ project.slug }} </p>
              <span class="has-text-weight-semibold">Project Description : </span>
              <p class="has-text-weight-normal dont-break-out">{{ project.description }}</p>
            </div>



          </template>
          <template v-slot:card-content v-else>
            No project description provided
          </template>
          <template v-slot:card-footer-content>
            <nuxt-link :to="`/projects/${project.slug}`" class="card-footer-item">

              <b-icon

                icon="pencil"
                size="is-small"
              >
              </b-icon>
            </nuxt-link>
            <a @click="deleteProject" class="card-footer-item">

              <b-icon

                icon="delete"
                size="is-small"
              >
              </b-icon>
            </a>
          </template>
        </card>


      </div>
    </masonry>


  </section>
</template>

<script>
import Card from '~/components/Card'
import {mapActions, mapGetters} from "vuex";
import {showToast} from "~/services/utils";


export default {
  name: 'HomePage',
  components: {
    Card
  },
  computed: {
    ...mapGetters({
      projects: 'projects/getProjects'
    })
  },
  data() {
    return {
      isLoading: false,
      isFullPageLoading: false,
    }
  },
  methods: {
    ...mapActions({
      getProjects: "projects/fetchProjects"
    }),
    deleteProject() {
      console.log("delete project triggered")
    },
    async loadProjects() {

      this.isLoading = true;
      try {

        await this.getProjects();

      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
      this.isLoading = false;

    }
  },

  async created() {

    await this.loadProjects()


  }
}
</script>

<style lang="scss" scoped>
.grid-item {
  min-width: 200px;
  //img{
  //  width: 100%;
  //}
}

.dont-break-out {

  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;

}
</style>

<template>
  <section class="section">
    <div v-if="isLoading">
      <b-loading :is-full-page="isFullPageLoading" :active="isLoading"  ></b-loading>
    </div>


    <masonry
      :cols="{default: 4, 1000: 3, 700: 1, 400: 1}"
      :gutter="{default: '30px', 700: '15px'}"
      v-else
    >
      <div v-for="project in projects" :key="project.id" style="padding: 10px">
        <card
          :title="project.projectName"
          icon="folder"
        >
          <template v-slot:card-content v-if="project.projectDescription">
            <p>Project Slug : {{ project.projectSlug }}</p>
            <p>{{ project.projectDescription }}</p>
          </template>
          <template v-slot:card-content v-else>
            No project description provided
          </template>
          <template v-slot:card-footer-content>
            <nuxt-link :to="`/projects/${project.projectSlug}`" class="card-footer-item">

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
      console.log("load projects triggered");
      try {
        this.isLoading = true;
        await this.getProjects();
        this.isLoading = false;
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
//.grid-item {
//  width: 200px;
//  img{
//    width: 100%;
//  }
//}
</style>

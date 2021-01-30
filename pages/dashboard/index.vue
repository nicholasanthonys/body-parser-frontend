<template>
  <section class="section">
    <div v-if="isLoading">
      <b-loading :is-full-page="isFullPageLoading" :active="isLoading"></b-loading>
    </div>

     <div v-else>
      <div class="columns is-multiline">
        <div class="column is-12">
          <p class="is-size-1 has-text-weight-bold"> Your Projects</p>
        </div>
        <div class="column is-12">
          <b-button type="is-primary has-text-weight-bold" @click="isComponentModalActive = true">Add New Project
          </b-button>
        </div>
      </div>

      <masonry
        :cols="{default: 3, 1000: 2, 700: 1, 400: 1}"
        :gutter="{default: '30px', 700: '15px'}"

      >
        <div v-for="project in projects" :key="project.id" style="padding: 10px">
          <card
            :title="project.name"
            icon="folder"

          >
            <template v-slot:card-content v-if="project.description">


              <div>
                <span class="has-text-weight-semibold"> Project Id : </span>
                <p class="dont-break-out">{{ project.id }} </p>
                <span class="has-text-weight-semibold">Project Description : </span>
                <p class="has-text-weight-normal dont-break-out">{{ project.description }}</p>
              </div>


            </template>
            <template v-slot:card-content v-else>
              No project description provided
            </template>
            <template v-slot:card-footer-content>
              <nuxt-link :to="`/projects/${project.id}`" class="card-footer-item">

                <b-icon

                  icon="pencil"
                  size="is-small"
                >
                </b-icon>
              </nuxt-link>
              <a @click="deleteProject(project.id)" class="card-footer-item">

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

    </div>


    <b-modal

      v-model="isComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Example Modal"

      aria-modal>

      <template #default="props">
        <div>
          <FormEditProject :project-prop="newProject" v-on:close="isComponentModalActive = false"
                           v-if="isComponentModalActive" mode="add"/>
        </div>

      </template>
    </b-modal>

  </section>
</template>

<script>
import Card from '~/components/Card'
import {mapActions, mapGetters} from "vuex";
import {showToast} from "~/services/utils";
import FormEditProject from "@/components/FormEditProject";

export default {
  name: 'HomePage',
  components: {
    Card,
    FormEditProject
  },
  computed: {
    ...mapGetters({
      projects: 'projects/getProjects'
    })
  },
  data() {
    return {
      isComponentModalActive: false,
      isLoading: false,
      isFullPageLoading: false,
      newProject: {
        name: null,
        description: null,
      },
    }
  },
  methods: {
    ...mapActions({
      getProjects: "projects/fetchProjects",
      deleteProjectById: 'projects/deleteProjectById'
    }),
    deleteProject(id) {
      this.$buefy.dialog.confirm({
        title: `Deleting project ${id}`,
        message: 'Are you sure you want to <b>delete</b> this project This action cannot be undone.',
        confirmText: 'Delete Project',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => await this.deleteProjectById(id),

      })
    },
    async loadProjects() {

      this.isLoading = true;
      try {

        await this.getProjects();

      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
      this.isLoading = false;
      this.$emit('close');
    },

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

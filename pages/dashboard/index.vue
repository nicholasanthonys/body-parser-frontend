<template>
  <section class="section">
    <div class="columns is-multiline" v-if="projects.length > 0">
      <div class="column is-4" v-for="project in projects" :key="project.id">
        <card
          :title="project.project_name"
          icon="github"

        >
          <template v-slot:card-content v-if="project.project_description">
            {{ project.project_description }}
          </template>
          <template v-slot:card-content v-else>
            No project description provided
          </template>

          <template v-slot:card-footer-content>
            <a href="#" class="card-footer-item">Save</a>
            <a href="#" class="card-footer-item">Edit</a>
            <a href="#" class="card-footer-item">Delete</a>
          </template>
        </card>
      </div>

    </div>

    <!--    <b-button @click="increment">Increment counter</b-button>-->
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
    }
  },
  methods: {
    ...mapActions({
      getProjects: "projects/fetchProjects"
    })
  },
  async created() {

    try {
      this.isLoading = true;
      await this.getProjects();
    } catch (err) {
      showToast(err.response.data.message, 'is-danger', 'is-bottom')
    }
    this.isLoading = false;
  }
}
</script>

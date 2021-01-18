<template>
  <section class="section">
    <p class="is-size-2">Project Detail
      <b-button
        v-if="selectedProject != null"
        @click="isComponentModalActive = true"
        type="is-primary"
        icon-left="pencil"/>
    </p>
    <div class="container" v-if="loading">
      <div>
        <b-skeleton :animated="skeletonAnimated"></b-skeleton>
        <b-skeleton :animated="skeletonAnimated"></b-skeleton>
        <b-skeleton :animated="skeletonAnimated"></b-skeleton>
      </div>

      <div class="container" style="height: 300px">
        <b-loading :is-full-page="false" :active="loading"></b-loading>
      </div>
    </div>
    <div class="container" v-else>
      <div v-if="selectedProject != null">
        <p class="title">
          {{ selectedProject.name }}
        </p>
        <p class="subtitle">{{ selectedProject.description }}</p>
      </div>


      <div class="container" v-if="selectedProject.configures.length >0">
        <b-table
          :data="selectedProject.configures"
          :loading="loading">

          <b-table-column label="Configure Name" v-slot="props">
            Configure-{{ props.index }}
          </b-table-column>

          <b-table-column label="Edit" v-slot="props">

            <div class="buttons">
              <b-button type="is-info" size="is-small" icon-left="pencil"
                        @click="$router.push(`${$route.params.projectSlug}/configures/${props.row._id}`)">Edit
              </b-button>

            </div>
          </b-table-column>

          <b-table-column label="Delete" v-slot="props">
            <b-button type="is-danger" size="is-small" icon-left="delete">Delete</b-button>
          </b-table-column>

        </b-table>
      </div>
      <div v-if="selectedProject.configures.length === 0" class="columns is-multiline"
           style="text-align: center;height: 30vh;justify-content: center;align-items: center">
        <div class="column is-12 "
        >
          <p class="is-size-3"> No Configures Provided</p>
        </div>
        <div class="column is-12">
          <b-button type="is-primary" icon-left="plus" @click="$router.push(`${selectedProject.slug}/configures/new`)">
            Add Configure
          </b-button>
        </div>

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
          <FormEditProject :project-prop="selectedProject" v-on:close="isComponentModalActive = false"
                           v-if="isComponentModalActive" mode="edit"/>
        </template>
      </b-modal>


      <div class="container">
        <div v-if="!selectedProject.response" class="columns is-multiline"
             style="text-align: center;height: 30vh;justify-content: center;align-items: center">


          <div class="column is-12">
            <p class="is-size-3"> No response.json provided</p>
          </div>

          <div class="column is-12">
            <b-button type="is-primary" icon-left="plus">Add Response</b-button>
          </div>


        </div>
        <div v-else>
          <p class="is-size-5" v-if="selectedProject.response != null">
            Edit response.json here
          </p>


          <b-button type="is-info" icon-left="pencil"
                    v-if="selectedProject.response != null && selectedProject.configures.length > 0">Edit
            Response
          </b-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {showToast} from "@/services/utils";
import {mapActions, mapGetters} from "vuex";
import FormEditProject from "@/components/FormEditProject";


export default {
  components: {FormEditProject},
  layout: 'nav',
  watch: {
    isComponentModalActive(newVal) {
      if (newVal) {
        this.form.name = this.selectedProject.name;
        this.form.description = this.selectedProject.description;
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedProject: 'projects/getSelectedProject'
    })
  },
  data() {
    return {

      form: {
        name: null,
        description: null
      },
      isComponentModalActive: false,
      skeletonAnimated: true,
      // total: 0,
      loading: false,
      sortField: 'vote_count',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: 20
    }
  },
  methods: {
    ...mapActions({
      getProjectBySlug: 'projects/fetchProjectBySlug'
    }),
    /*
* Load async data
*/async loadAsyncData() {
      this.loading = true;
      try {

        await this.getProjectBySlug(this.$route.params.projectSlug);
        console.log("selectedProject is");

        console.log(this.selectedProject);

      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom');
      }
      this.loading = false;


    },
    /*
* Handle page-change event
*/
    // onPageChange(page) {
    //   this.page = page
    //   this.loadAsyncData()
    // },
    /*
* Handle sort event
*/
    // onSort(field, order) {
    //   this.sortField = field
    //   this.sortOrder = order
    //   this.loadAsyncData()
    // },
    /*
* Type style in relation to the value
*/
    // type(value) {
    //   const number = parseFloat(value)
    //   if (number < 6) {
    //     return 'is-danger'
    //   } else if (number >= 6 && number < 8) {
    //     return 'is-warning'
    //   } else if (number >= 8) {
    //     return 'is-success'
    //   }
    // }
  },
  // filters: {
  //   /**
  //    * Filter to truncate string, accepts a length parameter
  //    */
  //   truncate(value, length) {
  //     return value.length > length
  //       ? value.substr(0, length) + '...'
  //       : value
  //   }
  // },
  async created() {
    await this.loadAsyncData()
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}
</style>

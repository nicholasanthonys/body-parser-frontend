<template>
  <section class="section">
    <div class="columns">
      <div class="column is-10">
        <p class="is-size-2">Project Detail
        </p>
      </div>
      <div class="column is-2" v-if="!loading">
        <b-button type="is-primary" icon-left="plus" expanded @click="updateSelectedProject()"> Save</b-button>
      </div>
    </div>

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
        <b-field label="Project Name">
          <b-input v-model="localStateSelectedProject.name">
          </b-input>
        </b-field>

        <b-field label="Project Description">
          <b-input type="textarea" v-model="localStateSelectedProject.description">

          </b-input>
        </b-field>

      </div>

      <hr>
      <div class="container" v-if="selectedProject.configures.length >0">
        <div class="columns is-multiline">
          <div class="column is-10">
            <p class="is-size-4 has-text-weight-medium"> Configures</p>
            <p>You can arrange your configuration order for sequential request</p>
          </div>

          <div class="column is-2">
            <b-button type="is-primary" icon-left="plus" expanded
                      @click="$router.push(`${localStateSelectedProject.id}/configures/new`) "> Add Configures
            </b-button>
          </div>
        </div>

        <draggable v-model="localStateSelectedProject.configures" group="people" @start="drag=true" @end="drag=false">
          <div class="columns is-multiline configure-item"
               v-for="(element,index) in localStateSelectedProject.configures" :key="element.id"
               style="border-bottom: 1px solid #bfbfbf; margin : 4px 0px">
            <div class="column is-3">
              Configure-{{ index }}

            </div>
            <div class="column is-3">
              {{ element.id }}
            </div>
            <div class="column is-3" style=" white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;">
              {{ element.description }}
            </div>
            <div class="column is-3">
              <div class="buttons">
                <b-button type="is-info" size="is-small" icon-left="pencil"
                          @click="$router.push(`${$route.params.projectId}/configures/${element.id}`)">Edit
                </b-button>
                <b-button type="is-danger" size="is-small" icon-left="delete" @click="deleteConfigure(element.id)">
                  Delete
                </b-button>
              </div>
            </div>
          </div>
        </draggable>

      </div>
      <div v-if="selectedProject.configures.length === 0" class="columns is-multiline"
           style="text-align: center;height: 30vh;justify-content: center;align-items: center">
        <div class="column is-12 "
        >
          <p class="is-size-3"> No Configures Provided</p>
        </div>
        <div class="column is-12">
          <b-button type="is-primary" icon-left="plus"
                    @click="$router.push(`${localStateSelectedProject.id}/configures/new`)">
            Add Configure
          </b-button>
        </div>

      </div>


      <div class="container">
        <div v-if="!selectedProject.finalResponse" class="columns is-multiline"
             style="text-align: center;height: 30vh;justify-content: center;align-items: center">


          <div class="column is-12">
            <p class="is-size-3"> No response.json provided</p>
            <p>Please Provide your response in this below editor</p>
          </div>

          <div class="column is-12" style="text-align: left">
            <Editor :prop-code="finalResponse" v-on:on-change-code="onChangeCode"/>
          </div>


        </div>
        <div v-else>
          <p class="is-size-5">
            Edit your project response here
          </p>


          <div class="column is-12">
            <Editor :prop-code="localStateSelectedProject.finalResponse" v-on:on-change-code="onChangeCode"/>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {showToast} from "@/services/utils";
import {mapActions, mapGetters} from "vuex";
import FormEditProject from "@/components/FormEditProject";
import draggable from 'vuedraggable'
import Editor from "@/components/Editor";

export default {
  components: {FormEditProject, draggable, Editor},
  layout: 'nav',

  computed: {
    ...mapGetters({
      selectedProject: 'projects/getSelectedProject'
    })
  },
  data() {
    return {
      localStateSelectedProject: null,
      isComponentModalActive: false,
      skeletonAnimated: true,
      loading: false,
      finalResponse: {
        configure_based: "",
        response: {
          transform: "",
          log_after_modify: "",
          adds: {
            header: {},
            body: {}
          },
          modifies: {
            header: {},
            body: {}
          },
          deletes: {
            header: [],
            body: []
          }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getProjectById: 'projects/fetchProjectById',
      updateProject: 'projects/updateProject',
      deleteSpecificConfigure: 'projects/deleteSpecificConfigure'
    }),

    onChangeCode(val) {

      this.localStateSelectedProject.finalResponse = val;
    },
    /*
* Load async data
*/async loadAsyncData() {
      this.loading = true;
      try {

        await this.getProjectById(this.$route.params.projectId);

        this.localStateSelectedProject = JSON.parse(JSON.stringify(this.selectedProject));


      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom');
      }
      this.loading = false;

    },
    async updateSelectedProject() {
      this.loading = true;
      try {
        await this.updateProject({project: this.localStateSelectedProject});

        showToast('Saved', 'is-success', 'is-bottom');



      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom');
      }
      this.loading = false;
    },
    async deleteConfigure(configureId) {
      this.loading = true;
      try {
        const {projectId} = this.$route.params
        await this.deleteSpecificConfigure({projectId, configureId})

      } catch (err) {
        showToast(err, 'is-danger', 'is-bottom');
      }
      this.loading = false;
    }

  },

  async created() {
    await this.loadAsyncData()
  },
  beforeRouteLeave(to, from, next) {

    this.$buefy.dialog.confirm({
      title: 'Leaving Page',
      message: 'Are you sure you want to <b>Leave</b> this page? Please <b> Save </b> your project first.',
      confirmText: 'Leave Page',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => next()
    })
  },

}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}

.configure-item:hover {
  cursor: grabbing;


}
</style>

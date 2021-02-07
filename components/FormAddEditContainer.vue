<template>
  <section class="section">
    <validation-observer ref="observer" v-slot="{handleSubmit}">
      <form @submit.prevent="handleSubmit(onSaveClicked)">
        <div class="columns is-multiline">
          <div class="column is-8">
            <p class="is-size-2">Configuration Container</p>
            <p v-if="localStateSelectedContainer.containerId" class="is-size-5"> Status Docker Container:
              <span :style="{
              color : localStateSelectedContainer.running ? 'green' : 'red'
            }"> {{ localStateSelectedContainer.running ? 'RUNNING' : 'STOPPED' }}</span></p>


            <b-icon
              v-if="!isTogglingStatus"
              :icon=" localStateSelectedContainer.running  ? 'pause' : 'play'"
              size="is-large"
              @click.native="toggleStatus(localStateSelectedContainer)"
              :type="localStateSelectedContainer.running  ? 'is-danger' : 'is-success'"
            >
            </b-icon>
            <b-loading :is-full-page="false" :active="isTogglingStatus" v-else></b-loading>


          </div>
          <div class="column " v-if="!loading">
            <div class="buttons">
              <b-button
                type="is-success"
                icon-left="plus"
                expanded
                native-type="submit"

                style="margin: 6px"
              >
                Save
              </b-button
              >

              <b-button
                @click="openRightBar()"
                type="is-primary"
                expanded
                style="margin: 6px"
              >Add more project
              </b-button>


              <b-button
                v-if="$route.name === 'containers-edit-id' "
                type="is-danger "
                expanded
                style="margin: 6px"
                :loading="isCreatingDockerContainer"
                @click.native="createContainer()"
              > {{ localStateSelectedContainer.containerId ? 'ReCreate Docker Container' : 'Create Docker Container' }}
              </b-button
              >
            </div>
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
          <p class="label">Configuration Container Id</p>
          <p>{{localStateSelectedContainer.id}}</p>
          <p class="label">Docker Container Id</p>
          <p>{{ localStateSelectedContainer.containerId ? localStateSelectedContainer.containerId : '-' }}</p>
          <div v-if="localStateSelectedContainer != null">
            <validation-provider v-slot="{ errors }" rules="required">
              <b-field label="Container Name">
                <b-input v-model="localStateSelectedContainer.name"></b-input>
              </b-field>
              <p style="color: red">{{ errors[0] }}</p>
            </validation-provider>

            <b-field label="Project Description">
              <b-input
                type="textarea"
                v-model="localStateSelectedContainer.description"
              >
              </b-input>
            </b-field>
          </div>

          <hr/>
          <p class="is-size-4 has-text-weight-bold"> Projects</p>
          <div class="container">
            <b-table
              :data="localStateSelectedContainer.projects"
              :loading="loading"
            >
              <b-table-column field="id" label="id" sortable v-slot="props">
                {{ props.row.id }}
              </b-table-column>

              <b-table-column field="name" label="Name" sortable v-slot="props">
                {{ props.row.name }}
              </b-table-column>

              <b-table-column label="Action" v-slot="props">
                <b-button
                  type="is-info"
                  size="is-small"
                  icon-left="pencil"
                  @click="$router.push(`/projects/${props.row.id}`)"
                >Edit
                </b-button>
                <b-button
                  type="is-danger"
                  size="is-small"
                  icon-left="delete"
                  @click="confirmRemoveProject(props.row.id)"
                >
                  Remove
                </b-button>
              </b-table-column>
            </b-table>
          </div>

          <div class="container">
            <div
              v-if="$route.name === 'containers-create' "
              class="columns is-multiline"
              style="
            text-align: center;
            height: 30vh;
            justify-content: center;
            align-items: center;
          "
            >

              <div class="column is-12">
                <p class="is-size-3">No router.json provided</p>
                <p>Please Provide your router in this below editor</p>
              </div>

              <div class="column is-12" style="text-align: left">

                <Editor
                  :prop-code="localStateSelectedContainer.routers"
                  v-on:on-change-code="onChangeCode"
                />
              </div>
            </div>

            <div v-else>
              <p class="is-size-5">Edit your container router here</p>

              <div class="column is-12">

                <Editor
                  :prop-code="localStateSelectedContainer.routers"
                  v-on:on-change-code="onChangeCode"
                />
              </div>
            </div>
          </div>
        </div>

        <section>
          <b-sidebar
            type="is-light"
            :fullheight="true"
            :fullwidth="false"
            :overlay="false"
            :right="true"
            v-model="isRightBarOpen"
          >
            <div class="p-1">
              <card
                :title="project.name"
                icon="folder"
                v-for="(project, index) in relatedProjects"
                :key="index"
                style="margin: 10px"
              >
                <template v-slot:card-content v-if="project.description">
                  <div>
                    <span class="has-text-weight-semibold"> Project id : </span>
                    <p class="dont-break-out">{{ project.id }}</p>
                  </div>
                  <b-button @click="addProject(project)"> Add</b-button>
                </template>
              </card>
            </div>
          </b-sidebar>
        </section>
      </form>
    </validation-observer>
  </section>
</template>

<script>
import {showToast} from "@/services/utils";
import {mapActions, mapMutations} from "vuex";
import FormEditProject from "@/components/FormEditProject";
import draggable from "vuedraggable";
import Editor from "@/components/Editor";
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  components: {FormEditProject, draggable, Editor, ValidationObserver, ValidationProvider},
  layout: "nav",
  props: {
    propsContainer: Object
  },
  watch: {
    propsContainer(val) {
      if (val) {
        this.localStateSelectedContainer = JSON.parse(JSON.stringify(val));
      }
    }
  },
  data() {
    return {

      isTogglingStatus: false,
      isRightBarOpen: false,
      isFetchingRelatedProject: false,
      relatedProjects: [],
      isCreatingDockerContainer: false,
      localStateSelectedContainer: {
        name: null,
        projects: [],
        description: null,
        routers: [
          {
            path: "",
            method: "",
            type: "",
            project_id: ""
          },
        ],
      },
      isComponentModalActive: false,
      skeletonAnimated: true,
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      fetchRelatedProjects: "projects/fetchProjects",
      createDockerContainer: 'containers/createDockerContainer',
      toggleStatusContainer: 'containers/toggleStatusContainer',
    }),
    ...mapMutations({
      setSelectedContainer: "containers/setSelectedContainer",
    }),

    async toggleStatus(data) {
      this.isTogglingStatus = true;
      try {
        await this.toggleStatusContainer(data)
        this.localStateSelectedContainer.running = !this.localStateSelectedContainer.running
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom');
      }
      this.isTogglingStatus = false;
    },
    async createContainer() {
      if (!this.localStateSelectedContainer.running) {
        this.isCreatingDockerContainer = true;
        try {
          const {id} = this.localStateSelectedContainer;
          let response = await this.createDockerContainer(id);
          this.localStateSelectedContainer.containerId = response.data.containerId;
          showToast('Docker container created', 'is-success', 'is-bottom')
        } catch (err) {
          showToast(err.response.data.message, 'is-danger', 'is-bottom')
        }
        this.isCreatingDockerContainer = false;
      } else {
        this.$buefy.dialog.alert({
          title: 'Container is running',
          message: 'Please <b>Stop</b> your container first !',
          confirmText: 'OK',
          type: 'is-danger',
        })
      }

    },
    onSaveClicked() {
      //validate method and path, make sure all filled

      let isRoutersValidated = true
      for (let i = 0; i < this.localStateSelectedContainer.routers.length; i++) {
        let routes = this.localStateSelectedContainer.routers[i]
        if (!routes.path || routes.path.trim().length === 0 || !routes.method || routes.method.trim().length === 0 || !routes.type || routes.type.trim().length === 0) {
          isRoutersValidated = false
          break;
        }
      }

      if (isRoutersValidated) {
        this.$emit('on-save', this.localStateSelectedContainer)
      } else {

        showToast('Please fill all method and routes', 'is-danger', 'is-bottom')
      }

    },
    addProject(project) {
      let isAlreadyAdded = false;
      this.localStateSelectedContainer.projects.forEach((e) => {
        if (e.id === project.id) {
          isAlreadyAdded = true;
        }
      });
      if (isAlreadyAdded) {
        showToast("Project already added", "is-danger", "is-bottom");
      } else {
        this.localStateSelectedContainer.projects.push(project);
      }
    },

    onChangeCode(val) {
      this.localStateSelectedContainer.routers = val;

    },
    async openRightBar() {
      this.isFetchingRelatedProject = true;
      try {
        let response = await this.fetchRelatedProjects();
        this.relatedProjects = response.data;
        this.isRightBarOpen = true;
      } catch (err) {
        showToast(err.toString, "is-danger", "is-bottom");
      }
      this.isFetchingRelatedProject = false;
    },
    confirmRemoveProject(projectId) {
      this.$buefy.dialog.confirm({
        title: "Remove Project from container",
        message:
          "Are you sure you want to <b>Remove</b> this project from this container? ",
        confirmText: "Remove",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => await this.removeProject(projectId),
      });
    },

    async removeProject(projectId) {
      this.loading = true;
      let temp = this.localStateSelectedContainer.projects.filter(
        (e) => e.id !== projectId
      );
      this.localStateSelectedContainer.projects = [...temp];
      this.loading = false;
    },
  },

  async created() {

    if (this.propsContainer) {
      this.localStateSelectedContainer = JSON.parse(JSON.stringify(this.propsContainer));
    }
  },
  beforeRouteLeave(to, from, next) {

    this.$buefy.dialog.confirm({
      title: "Leaving Page",
      message:
        "Are you sure you want to <b>Leave</b> this page? Please <b> Save </b> your project first.",
      confirmText: "Leave Page",
      type: "is-danger",
      hasIcon: true,
      onConfirm: () => next(),
    });
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}

.configure-item:hover {
  cursor: grabbing;
}
</style>

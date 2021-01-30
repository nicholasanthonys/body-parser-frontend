<template>
  <section class="section">
    <div class="columns">
      <div class="column is-10">
        <p class="is-size-2">Container Detail</p>
      </div>
      <div class="column is-2" v-if="!loading">
        <div class="buttons">
          <b-button
            type="is-success"
            icon-left="plus"
            expanded
            @click="onSaveClicked"
            style="margin: 6px"
          >
            Save</b-button
          >

          <b-button
            @click="openRightBar()"
            type="is-primary"
            expanded
            style="margin: 6px"
            >Add more project</b-button
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
      <div v-if="localStateSelectedContainer != null">
        <b-field label="Container Name">
          <b-input v-model="localStateSelectedContainer.name"> </b-input>
        </b-field>

        <b-field label="Project Description">
          <b-input
            type="textarea"
            v-model="localStateSelectedContainer.description"
          >
          </b-input>
        </b-field>
      </div>

      <hr />
        <p class="is-size-4 has-text-weight-bold"> Projects</p>
      <div class="container">
        <b-table
          :data="localStateSelectedContainer.projects"
          :loading="loading"
        >
          <b-table-column field="_id" label="id" sortable v-slot="props">
            {{ props.row._id }}
          </b-table-column>

          <b-table-column field="name" label="Name" sortable v-slot="props">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column field="slug" label="Slug" sortable v-slot="props">
            {{ props.row.slug }}
          </b-table-column>

          <b-table-column label="Action" v-slot="props">
            <b-button
              type="is-info"
              size="is-small"
              icon-left="pencil"
              @click="$router.push(`/projects/${props.row.slug}`)"
              >Edit
            </b-button>
            <b-button
              type="is-danger"
              size="is-small"
              icon-left="delete"
              @click="confirmRemoveProject(props.row._id)"
            >
              Remove
            </b-button>
          </b-table-column>
        </b-table>
      </div>

      <div class="container">
        <div
          v-if="$route.params.containerSlug === 'new'"
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
                <span class="has-text-weight-semibold"> Project Slug : </span>
                <p class="dont-break-out">{{ project.slug }}</p>
                <span class="has-text-weight-semibold"> Project id : </span>
                <p class="dont-break-out">{{ project._id }}</p>
              </div>
              <b-button @click="addProject(project)"> Add </b-button>
            </template>
          </card>
        </div>
      </b-sidebar>
    </section>
  </section>
</template>

<script>
import { showToast } from "@/services/utils";
import { mapActions, mapGetters, mapMutations } from "vuex";
import FormEditProject from "@/components/FormEditProject";
import draggable from "vuedraggable";
import Editor from "@/components/Editor";

export default {
  components: { FormEditProject, draggable, Editor },
  layout: "nav",
    props : {
        propsContainer : Object
    },
  watch : {
   // 'propsContainer' : function(val){
   //   console.log("propsContainer is");
   //   console.log(val);
   //    this.localStateSelectedContainer = JSON.parse(JSON.stringify(val));
   //   console.log(this.localStateSelectedContainer);
   //  },

  },
  data() {
    return {
      isRightBarOpen: false,
      isFetchingRelatedProject: false,
      relatedProjects: [],
      localStateSelectedContainer: {
        slug: null,
        name: null,
        projects: [],
        description: null,
        routers: [
          {
            path: "",
            project_directory: "",
            method: "",
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
    }),
    ...mapMutations({
      setSelectedContainer: "containers/setSelectedContainer",
    }),
    onSaveClicked(){

      this.$emit('on-save',this.localStateSelectedContainer)
    },
    addProject(project) {
      let isAlreadyAdded = false;
      this.localStateSelectedContainer.projects.forEach((e) => {
        if (e._id === project._id) {
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
        (e) => e._id !== projectId
      );
      this.localStateSelectedContainer.projects = [...temp];
      this.loading = false;
    },
  },

  async created() {
    // const { containerSlug } = this.$route.params;
    // if (containerSlug !== "new") {
    //   await this.loadAsyncData();
    // }
    if(this.propsContainer){
      this.localStateSelectedContainer = JSON.parse(JSON.stringify(this.propsContainer));
      console.log("lcoal state selected container is");
      console.log(this.localStateSelectedContainer);

    }
  },
  beforeRouteLeave(to, from, next) {
    console.log("to is");
    console.log(to);
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

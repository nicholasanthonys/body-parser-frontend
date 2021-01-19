<template>
  <section class="section">
    <div class="container" style="height: 300px" v-if="isLoading">
      <b-loading :is-full-page="false" :active="isLoading"></b-loading>
    </div>

    <div class="container" v-else>
      <div class="header" style="margin:20px 0px">
        <div class="columns is-multiline">
          <div class="column is-10">
            <p class="title">Configuration Description</p>
          </div>
          <div class="column is-2">
            <b-button type="is-primary" expanded :icon-left="isNew ? 'plus' : 'pencil'" @click="onSubmit()">
              {{ isNew ? 'Save Configure' : 'Update Configure' }}
            </b-button>
          </div>

          <div class="column is-12">
            <b-input v-model="configure.description" type="textarea"></b-input>
          </div>
        </div>


      </div>

      <Editor :prop-code="configure.config" v-on:on-change-code="onChangeCode"/>


    </div>
  </section>
</template>

<script>
import {mapMutations} from 'vuex';
import {showToast} from "@/services/utils";
import Editor from "@/components/Editor";

export default {
  layout: 'nav',
  components: {
    Editor
  },
  data() {
    return {
      isNew: this.$route.params.configureId === 'new',
      isLoading: false,
      configure: {
        _id: null,
        projectId: null,
        config: {
          request: {
            destination_url: "",
            destination_path: "",
            method: "",
            transform: "",
            log_before_modify: "",
            log_after_modify: "",
            adds: {
              header: {},
              body: {},
              query: {}
            },
            modifies: {
              header: {},
              body: {},
              query: {}
            },
            deletes: {
              header: [],
              body: [],
              query: []
            }
          },
          response: {
            transform: "",
            log_before_modify: "",
            log_after_modify: "",
            adds: {
              header: {},
              body: {},
              query: {}
            },
            modifies: {
              body: {}
            },
            deletes: {
              body: []
            }
          }
        },
        description: null,
      },

    }
  },
  methods: {
    ...mapMutations({
      setSelectedProject: 'projects/setSelectedProject'

    }),
    onChangeCode(val) {

      this.configure.config = val;


    },
    async loadConfigure() {
      const {projectSlug, configureId} = this.$route.params

      this.isLoading = true;
      try {
        let res = await this.$axios.get(`/configure`, {
          params: {
            projectSlug,
            configureId
          }
        })
        const {config,description} = res.data;

        if (config) {
          this.configure.config = config;
          this.configure.description = description;
        }

      } catch (err) {
        showToast(err.response.data.message)
      }
      this.isLoading = false;
    },
    async newConfigure() {
      const {projectSlug, } = this.$route.params;
      try {
        let response =  await this.$axios.post(`/configure`, {
          projectSlug,
          description : this.configure.description,
          config: this.configure.config
        });
        this.setSelectedProject(response.data)
        await this.$router.push(`/projects/${projectSlug}`)
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-top')
      }
    },
    async updateConfigure() {
      const {projectSlug, configureId} = this.$route.params;
      try {
        let response = await this.$axios.put(`/configure?projectSlug=${projectSlug}&configureId=${configureId}`, {

          description : this.configure.description,
          config: this.configure.config
        });
        this.setSelectedProject(response.data)
        this.$router.go(-1)
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-top')
      }
    },
    async onSubmit() {
      if(this.isNew) {
        await this.newConfigure();
      }else{
        await this.updateConfigure();
      }
    },
  },
  async created() {

    if (!this.isNew) {
      await this.loadConfigure();
    }

  }
}
</script>

<style scoped>

</style>

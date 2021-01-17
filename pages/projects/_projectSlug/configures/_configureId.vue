<template>
  <section class="section">
    <div class="container" style="height: 300px" v-if="isLoading">
      <b-loading :is-full-page="false" :active="isLoading"></b-loading>
    </div>

    <div class="container" v-else>
      <div class="header" style="margin:20px 0px">
        <p class="title">Configuration Description</p>

          <b-input v-model="configure.description"  type="textarea"></b-input>

      </div>

      <Editor :prop-code="configure.config" v-on:on-change-code="onChangeCode"/>
    </div>
  </section>
</template>

<script>
import {showToast} from "@/services/utils";
import Editor from "@/components/Editor";
export default {
  layout : 'nav',
  components : {
    Editor
  },
  data(){
    return{
      isLoading : false,
        configure : {
          _id : null,
          projectId : null,
          config : null,
          description : null,
        },
      description : null,
    }
  },
  methods : {
    onChangeCode(val){

      this.configure.config = val;

      console.log(this.configure)
    },
    async loadConfigure(){
      const {projectSlug,configureId} = this.$route.params

      this.isLoading = true;
      try{
        let res = await this.$axios.get(`/configure`,{
          params : {
            projectSlug,
            configureId
          }
        })
        const {configure,description} = res.data;


        if(configure){
          this.configure = configure;
        }

        if(description){
          this.description = description
        }

      }catch (err) {
        showToast(err.response.data.message)
      }
      this.isLoading = false;
    }
  },
  async created() {
    await this.loadConfigure();
  }
}
</script>

<style scoped>

</style>

<template>
  <section class="section">
    <div class="container" style="height: 300px" v-if="isLoading">
      <b-loading :is-full-page="false" :active="isLoading"></b-loading>
    </div>

    <div class="container" v-else>
      <div class="header" style="margin:20px 0px">
        <p class="title">Configuration Description</p>
        <p class="subtitle">{{description}}</p>
      </div>

      <Editor :prop-code="configure" v-on:on-change-code="onChangeCode"/>
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

        configure : {},


      description : null,
    }
  },
  methods : {
    onChangeCode(val){

      this.configure = val;

      console.log(this.configure)
    },
    async loadConfigure(){
      const {projectSlug,configureName} = this.$route.params
      // console.log("projectSlug is");
      // console.log(projectSlug);
      // console.log("configure Name is")
      // console.log(configureName);
      this.isLoading = true;
      try{
        let res = await this.$axios.get(`/projects/${projectSlug}/configures/${configureName}`)
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

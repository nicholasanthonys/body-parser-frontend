<template>
  <section>
    <form-add-edit-container :props-container="selectedContainer" v-on:on-save="update" v-if="!loading"/>
    <b-loading :is-full-page="false" :active="loading" v-else></b-loading>

  </section>
</template>


<script>
import FormAddEditContainer from '@/components/FormAddEditContainer';
import {mapActions} from "vuex";
import {showToast} from "@/services/utils";
export default {
  layout : 'nav',
  components : {
    FormAddEditContainer

  },
  data(){
    return {
      selectedContainer : {
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
      loading: false,
    }
  },
  methods : {
    ...mapActions({
      updateContainer : 'containers/updateContainer',
      fetchSelectedContainer: "containers/fetchContainerById",

    }),
  async update(updatedContainer){
    try {

      //* Get array of projectIds
      let projectIds = [];
      updatedContainer.projects.forEach((e) => projectIds.push(e.id));
      updatedContainer.projectIds = projectIds;

      // Get array of router object
      let routers = [];
      //* Get array from routers
      for (let k in updatedContainer.routers) {
        if (updatedContainer.routers.hasOwnProperty(k)) {
          routers.push(updatedContainer.routers[k]);
        }
      }
      updatedContainer.routers = routers;

     await this.updateContainer({
        id : updatedContainer.id,
        name : updatedContainer.name,
        containerId : updatedContainer.containerid,
        description : updatedContainer.description,
        projectIds : updatedContainer.projectIds,
        routers : updatedContainer.routers
      });
      // const {container} = response.data;
      // this.selectedContainer = container;

      showToast('Update success', 'is-success', 'is-bottom');

    } catch (err) {
      showToast(err.response.data.message, "is-danger", "is-bottom");
    }
  },
     async loadContainerDetail() {
      this.loading = true;
      try {
        const { id } = this.$route.params;
        let response = await this.fetchSelectedContainer(id);
        let {container} = response.data;
        this.selectedContainer = container;
      } catch (err) {
        showToast(err.response.data.message, "is-danger", "is-bottom");
      }
      this.loading = false;
    },
  },
  async created() {
    await this.loadContainerDetail();
  }
}
</script>

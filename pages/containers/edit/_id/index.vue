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
    this.loading = true;

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

      let response = await this.updateContainer(updatedContainer);
      const {container} = response.data;
      this.selectedContainer = container;

      showToast('Update success', 'is-success', 'is-bottom');

    } catch (err) {
      showToast(err.response.data.message, "is-danger", "is-bottom");
    }
    this.loading = false;
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

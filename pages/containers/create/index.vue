<template>
  <section>
    <form-add-edit-container v-on:on-save="createNewContainer"  v-if="!loading"/>
  </section>
</template>

<script>
import FormAddEditContainer from "@/components/FormAddEditContainer";
import { mapActions, mapGetters, mapMutations } from "vuex";
import {showToast} from "@/services/utils";

export default {
  layout : 'nav',
  components: {
    FormAddEditContainer,
  },
  data(){
      return {
          loading : false,
      }
  },
  methods: {
    ...mapActions({
      storeContainer: "containers/storeContainer",
    }),

    async createNewContainer(newContainer) {
      this.loading = true;

      try {
        //* Get array of projectIds
        let projectIds = [];
        newContainer.projects.forEach((e) => projectIds.push(e.id));
        newContainer.projectIds = projectIds;


        await this.storeContainer(newContainer);
        this.$router.push({name : 'dashboard-containers'})
        showToast("Saved", "is-success", "is-bottom");


      } catch (err) {
        showToast(err.toString(), "is-danger", "is-bottom");
      }
      this.loading = false;
    },
  },
};
</script>



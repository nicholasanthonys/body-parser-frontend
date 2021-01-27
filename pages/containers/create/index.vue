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
        newContainer.projects.forEach((e) => projectIds.push(e._id));
        newContainer.projectIds = projectIds;
        let routers = [];
        //* Get array from routers
        for (let k in newContainer.routers) {
          if (newContainer.routers.hasOwnProperty(k)) {
            routers.push(newContainer.routers[k]);
          }
        }

        newContainer.routers = routers;
        let response = await this.storeContainer(newContainer);

        showToast("Saved", "is-success", "is-bottom");

        await this.$router.replace(`/containers/edit/${response.data.slug}`);
      } catch (err) {
        showToast(err.toString(), "is-danger", "is-bottom");
      }
      this.loading = false;
    },
  },
};
</script>



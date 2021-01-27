<template>
  <section class="section">

    <div v-if="isLoading">
      <b-loading :is-full-page="isFullPageLoading" :active="isLoading"></b-loading>
    </div>

    <div v-else>
      <div class="columns is-multiline">
        <div class="column is-12">
          <p class="is-size-1 has-text-weight-bold"> Your Containers</p>
        </div>
        <div class="column is-12">
          <b-button type="is-primary has-text-weight-bold" >Add New Container
          </b-button>
        </div>
      </div>


      <masonry
        :cols="{default: 3, 1000: 2, 700: 1, 400: 1}"
        :gutter="{default: '30px', 700: '15px'}"

      >
        <div v-for="container in containers" :key="container._id" style="padding: 10px">
          <card
            :title="container.name"
            icon="cube"

          >
            <template v-slot:card-content v-if="container.description">
              <div>
                <span class="has-text-weight-semibold"> Container Slug : </span>
                <p class="dont-break-out">{{ container.slug }} </p>

                <span class="has-text-weight-semibold">Container Status : </span>
                <p class="has-text-weight-normal dont-break-out" :style="{
                  color :
                  container.status==='running' ? 'green' : 'red'
                }">{{ container.status }}</p>

                <span class="has-text-weight-semibold">Container Description : </span>
                <p class="has-text-weight-normal dont-break-out">{{ container.description }}</p>
              </div>
            </template>
            <template v-slot:card-content v-else>
              No container description provided
            </template>
            <template v-slot:card-footer-content>
              <nuxt-link :to="`/containers/edit/${container.slug}`" class="card-footer-item">
                <b-icon
                  icon="pencil"
                  size="is-small"
                >
                </b-icon>
              </nuxt-link>
              <a  class="card-footer-item">

                <b-icon
                  icon="delete"
                  size="is-small"
                >
                </b-icon>
              </a>
            </template>
          </card>
        </div>
      </masonry>


    </div>


  </section>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {showToast} from "@/services/utils";

export default {
  computed : {
    ...mapGetters({
      containers: 'containers/getContainers'
    })
  },
  data(){
    return {
      isLoading : false,
      isFullPageLoading: false,
    }
  },
  methods : {
    ...mapActions({
      fetchContainers : 'containers/fetchContainers'
    }),
    async loadContainers(){
      this.isLoading = true;
      try {
        await this.fetchContainers();
        console.log("containers is");
        console.log(this.containers)
      }catch (err) {
        showToast(err.response.data.message, 'is-danger','is-bottom')
      }
      this.isLoading = false;
    }

  },
  async created() {
    await this.loadContainers();
  }

}
</script>





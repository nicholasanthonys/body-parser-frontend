<template>
  <section class="section">

    <div v-if="isLoading">
      <b-loading :is-full-page="isFullPageLoading" :active="isLoading"></b-loading>
    </div>

    <div v-else>
      <div class="columns is-multiline">
        <div class="column is-12">
          <p class="is-size-1 has-text-weight-bold"> Your Configuration Containers</p>
        </div>
        <div class="column is-12">
          <b-button type="is-primary has-text-weight-bold" @click="$router.push('/containers/create')">Add New Container
          </b-button>
        </div>
      </div>


      <masonry
        :cols="{default: 3, 1000: 2, 700: 1, 400: 1}"
        :gutter="{default: '30px', 700: '15px'}"

      >
        <div v-for="container in containers" :key="container.id" style="padding: 10px">
          <card
            :title="container.name"
            icon="cube"

          >
            <template v-slot:card-content v-if="container.description">
              <div>
                <span class="has-text-weight-semibold"> Container Configuration Id : </span>
                <p class="dont-break-out">{{ container.id }} </p>
                <span class="has-text-weight-semibold"> Container created  : </span>
                <p class="dont-break-out">{{ container.isContainerCreated ? 'Created' : 'Not Created' }} </p>
                <span class="has-text-weight-semibold"> Docker Container Id : </span>
                <p class="dont-break-out">{{ container.containerId ? container.containerId : '-' }} </p>

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
              <nuxt-link :to="`/containers/edit/${container.id}`" class="card-footer-item">
                <b-icon
                  icon="pencil"
                  size="is-small"
                >
                </b-icon>
              </nuxt-link>
              <a class="card-footer-item">

                <b-icon
                  icon="delete"
                  size="is-small"
                  @click.native="confirmDeleteContainer(container)"
                >
                </b-icon>
              </a>
              <a class="card-footer-item">
                <b-icon
                  v-if="!isTogglingStatus"
                  :icon=" container.status === 'running' ? 'pause' : 'play'"
                  size="is-small"
                  @click.native="toggleStatus(container)"
                >
                </b-icon>
                <b-loading :is-full-page="false" :active="isTogglingStatus" v-else></b-loading>

              </a>
            </template>
          </card>
        </div>
      </masonry>


    </div>


  </section>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import {showToast} from "@/services/utils";

export default {
  computed: {
    ...mapGetters({
      containers: 'containers/getContainers'
    })
  },
  data() {
    return {
      isLoading: false,
      isFullPageLoading: false,
      isTogglingStatus: false,
    }
  },
  methods: {
    ...mapActions({
      fetchContainers: 'containers/fetchContainers',
      deleteContainerById: 'containers/deleteContainer',
      toggleStatusContainer: 'containers/toggleStatusContainer',
    }),
    ...mapMutations({
      updateSpecificContainer: 'containers/updateSpecificContainer'
    }),
    async toggleStatus(data) {
      this.isTogglingStatus = true;
      try {
        await this.toggleStatusContainer(data)
        this.updateSpecificContainer(data);
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom');
      }
      this.isTogglingStatus = false;
    },
    async confirmDeleteContainer(container) {
      this.$buefy.dialog.confirm({
        title: `Deleting container ${container.id}`,
        message: 'Are you sure you want to <b>delete</b> this container ?',
        confirmText: 'Delete Container',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => await this.deleteContainer(container.id),

      })
    },
    async deleteContainer(id) {
      this.isLoading = true;
      try {
        await this.deleteContainerById(id);
        showToast('Delete Success', 'is-success', 'is-bottom');
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
      this.isLoading = false;
    },
    async loadContainers() {
      this.isLoading = true;
      try {
        await this.fetchContainers();

      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom')
      }
      this.isLoading = false;
    }

  },
  async created() {
    await this.loadContainers();
  }

}
</script>





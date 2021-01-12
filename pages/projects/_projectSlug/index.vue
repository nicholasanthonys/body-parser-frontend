<template>
  <section class="section">
    <p class="is-size-2">Project Detail</p>
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
      <p class="title">
        {{ data.project.projectName }}
      </p>
      <p class="subtitle">{{ data.project.projectDescription }}</p>
      <div>
        <b-table
          :data="data.configures"
          :loading="loading">

          <b-table-column label="Configure Name" v-slot="props">
            {{ props.row }}
          </b-table-column>

          <b-table-column label="Edit" v-slot="props">

            <div class="buttons">
              <b-button type="is-info" size="is-small" icon-left="pencil"
                        @click="$router.push(`${$route.params.projectSlug}/configures/${props.row.replace('.json','')}`)">Edit
              </b-button>

            </div>
          </b-table-column>

          <b-table-column label="Delete" v-slot="props">
            <b-button type="is-danger" size="is-small" icon-left="delete">Delete</b-button>
          </b-table-column>

        </b-table>
      </div>

    </div>

    <div class="container">
      <div v-if="!data.response">
        <p class="is-size-5">
          No response.json provided
        </p>
        <b-button type="is-primary" icon-left="plus">Add Response</b-button>
      </div>
      <div v-else>
        <p class="is-size-5">
          Edit response.json here
        </p>
        <b-button type="is-info" icon-left="pencil">Edit Response</b-button>
      </div>
    </div>

  </section>
</template>

<script>
import {showToast} from "@/services/utils";
import {mapActions} from "vuex";

export default {
  layout: 'nav',
  data() {
    return {
      data: {
        project: null,
        configures: [],
        response: null
      },
      skeletonAnimated: true,
      // total: 0,
      loading: false,
      sortField: 'vote_count',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: 20
    }
  },
  methods: {
    ...mapActions({
      getProjectBySlug : 'projects/fetchProjectBySlug'
    }),
    /*
* Load async data
*/async loadAsyncData() {

      try {
        this.loading = true;
        let response = await this.getProjectBySlug(this.$route.params.projectSlug);
        this.data = response.data;
        console.log("response data is");
        console.log(response.data);
      } catch (err) {
        showToast(err.response.data.message, 'is-danger', 'is-bottom');
      }
      this.loading = false;


    },
    /*
* Handle page-change event
*/
    onPageChange(page) {
      this.page = page
      this.loadAsyncData()
    },
    /*
* Handle sort event
*/
    onSort(field, order) {
      this.sortField = field
      this.sortOrder = order
      this.loadAsyncData()
    },
    /*
* Type style in relation to the value
*/
    type(value) {
      const number = parseFloat(value)
      if (number < 6) {
        return 'is-danger'
      } else if (number >= 6 && number < 8) {
        return 'is-warning'
      } else if (number >= 8) {
        return 'is-success'
      }
    }
  },
  filters: {
    /**
     * Filter to truncate string, accepts a length parameter
     */
    truncate(value, length) {
      return value.length > length
        ? value.substr(0, length) + '...'
        : value
    }
  },
  async created() {
    await this.loadAsyncData()
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
}
</style>

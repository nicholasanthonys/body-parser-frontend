<template>
  <section>
    <validation-observer ref="observer" v-slot="{handleSubmit}">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Edit Project</p>
            <button
              type="button"
              class="delete"
              @click="emitClose()"/>
          </header>
          <section class="modal-card-body">
            <b-field label="Title">
              <validation-provider v-slot="{ errors }" rules="required">
                <b-input
                  maxlength="20"
                  type="text"
                  v-model="project.name"
                  placeholder="Project tile"
                  required>
                </b-input>
              </validation-provider>

            </b-field>

            <b-field label="Description">
              <b-input
                type="textarea"
                v-model="project.description"
                placeholder="Project Description"
                required>
              </b-input>
            </b-field>


          </section>
          <footer class="modal-card-foot">
            <b-button
              label="Close"
              @click="emitClose()"/>
            <b-button
              :loading="isLoading"
              label="Save"
              native-type="submit"
              type="is-primary"/>
          </footer>
        </div>
      </form>
    </validation-observer>
  </section>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import {mapActions} from "vuex";
import {showToast} from "@/services/utils";

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    projectProp: Object,
    mode: String,
  },
  watch: {
    projectProp(val) {

      this.project = {...val};
    }
  },
  data() {
    return {
      project: {...this.projectProp},
      isLoading: false,
    }
  },
  methods: {
    ...mapActions({
      addNewProject: 'projects/saveProject'
    }),
    async addProject(){
      try {

          await this.addNewProject(this.project);
          showToast('Add Success', 'is-success', 'is-bottom')

      } catch (err) {
        showToast(err.response.data.message, 'is-success', 'is-bottom')
      }
    },
    async onSubmit() {
      this.isLoading = false;
      if(this.mode === 'add'){
        await this.addProject()
      }
      this.isLoading = false;
      this.emitClose();
    },
    emitClose() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {

      this.$nextTick(() => {
        this.$refs.observer.reset();
      });
    }
  },
  mounted() {
    this.project = {...this.projectProp}

  }
}
</script>

<style lang="scss" scoped>
.form-project {

  @media (max-width: 500px) {
    width: 100%;
  }

  @media (min-width: 501px)  and  (max-width: 1023px) {
    width: 100%;
  }
  @media (min-width: 1024px) and  (max-width: 1366px){
    width: 960px;
  }
  @media(min-width: 1366px ){
    width: 1024px;
  }
}
</style>

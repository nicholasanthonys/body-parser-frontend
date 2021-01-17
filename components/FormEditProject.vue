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

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    projectProp: Object
  },
  watch: {
    projectProp(val) {
      console.log("watcher tirggered");
      this.project = {...val};
    }
  },
  data() {
    return {
      project: {...this.projectProp}
    }
  },
  methods: {
    onSubmit() {
      console.log("submit triggered");
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

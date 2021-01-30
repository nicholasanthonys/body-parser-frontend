export const state = () => ({
  projects: [],
  selectedProject: null
})

export const getters = {
  getProjects: state => {
    return state.projects
  },
  getSelectedProject: state => {
    return state.selectedProject;
  }
}
export const actions = {
  async saveProject(context, data) {
    return new Promise(((resolve, reject) => {
      this.$axios.post('/project', data)
        .then(response => {

          if (response.status === 200) {
            context.commit("addNewProject", response.data)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  updateProject(context, data) {
    return new Promise(((resolve, reject) => {
      this.$axios.put('/project', data)
        .then(response => {
          if (response.status === 200) {
            const {project} = response.data
            context.commit("setSelectedProject", project)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async fetchProjects(context) {
    return new Promise(((resolve, reject) => {
      this.$axios.get('/project')
        .then(response => {

          if (response.status === 200) {
            context.commit("setProjects", response.data)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  // Get project detail
  async fetchProjectById(context, id) {
    return new Promise(((resolve, reject) => {
      this.$axios.get(`/project/${id}`)
        .then(response => {
          if (response.status === 200) {
            const {project} = response.data

            context.commit("setSelectedProject", project)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },

  // Delete project detail
  async deleteProjectById(context, id) {
    return new Promise(((resolve, reject) => {
      this.$axios.delete(`/project/${id}`)
        .then(response => {

          context.commit("removeProjectById", id)

          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async deleteSpecificConfigure(context, data) {
    const {projectId, configureId} = data;
    return new Promise(((resolve, reject) => {
      this.$axios.delete(`/configure`, {
        params: {
          projectId,
          configureId
        }
      })
        .then(response => {

          context.commit("removeSpecificConfigure", configureId)

          resolve(response)
        }).catch(error => reject(error));
    }))
  }
}
export const mutations = {
  addNewProject(state, data) {
    // Push to first element
    state.projects = [data, ...state.projects];
  },
  setProjects(state, data) {
    state.projects = data;
  },
  setSelectedProject(state, data) {
    state.selectedProject = data;
  },
  removeProjectById(state, id) {
    state.projects = [...state.projects.filter(element => element.id !== id)]
  },
  removeSpecificConfigure(state, configureId) {
    state.selectedProject.configures = [...state.selectedProject.configures.filter(element => element.id !== configureId)];
  }


}

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
  async fetchProjectBySlug(context, projectSlug) {
    return new Promise(((resolve, reject) => {
      this.$axios.get(`/project/${projectSlug}`)
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
  async deleteProjectBySlug(context, projectSlug) {
    return new Promise(((resolve, reject) => {
      this.$axios.delete(`/project/${projectSlug}`)
        .then(response => {

          context.commit("removeProjectBySlug", projectSlug)

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
  removeProjectBySlug(state, slug) {
    state.projects = [...state.projects.filter(element => element.slug !== slug)]
  },


}

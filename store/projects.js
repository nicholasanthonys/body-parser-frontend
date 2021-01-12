export const state = () => ({
  projects: [],
  selectedProject : null,
})

export const getters = {
  getProjects: state => {
    return state.projects
  },
  getProjectBySlug : state=> {
    return state.selectedProject;
  }
}
export const actions = {
  async fetchProjects(context) {
    return new Promise(((resolve, reject) => {
      this.$axios.get('/projects/all')
        .then(response => {
          if (response.status === 200) {
            context.commit("setProjects", response.data)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async fetchProjectBySlug(context,projectSlug){
    return new Promise(((resolve, reject) => {
      this.$axios.get(`/projects/${projectSlug}`)
        .then(response => {
          if (response.status === 200) {
            context.commit("setSelectedProject", response.data)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  }
}
export const mutations = {
  setProjects(state, data) {
    state.projects = data;
  },
  setSelectedProject(state,data){
    state.selectedProject = data;
  }

}

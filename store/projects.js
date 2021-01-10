export const state = () => ({
  projects: []
})

export const getters = {
  getProjects: state => {
    return state.projects
  }
}
export const actions = {
  async fetchProjects(context) {
    return new Promise(((resolve, reject) => {
      this.$axios.get('/projects/all')
        .then(response => {
          if (response.status === 200) {
            console.log("response data is");
            console.log(response.data);
            context.commit("setProjects",response.data)
          }
        })
    }))
  }
}
export const mutations = {
  setProjects(state, data) {
    state.projects = data;
  },

}

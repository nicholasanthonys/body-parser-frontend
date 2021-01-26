export const state = () => ({
  containers: [],
  selectedContainer : null,

})

export const getters = {
  getContainers: state => {
    return state.containers
  },
  getSelectedContainer : state => {
    return state.selectedContainer
  }
}
export const actions = {

  async fetchContainers(context) {
    return new Promise(((resolve, reject) => {
      this.$axios.get('/container')
        .then(response => {

          if (response.status === 200) {
            context.commit("setContainers", response.data)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async fetchContainerBySlug(context,containerSlug) {
    return new Promise(((resolve, reject) => {
      this.$axios.get(`/container/${containerSlug}`)
        .then(response => {
          if (response.status === 200) {
            context.commit("setSelectedContainer", response.data)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
}
export const mutations = {
  setContainers(state,data){
    state.containers = data;
  },
  setSelectedContainer(state,data){
    state.selectedContainer = data;
  }
}

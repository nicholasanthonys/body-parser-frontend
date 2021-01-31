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
  async storeContainer(context,data){
    return new Promise(((resolve, reject) => {
      this.$axios.post('/container',data)
        .then(response => {
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
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
  async fetchContainerById(context,id) {
    return new Promise(((resolve, reject) => {
      this.$axios.get(`/container/${id}`)
        .then(response => {
          if (response.status === 200) {
            context.commit("setSelectedContainer", response.data.container)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async  updateContainer(context,data){
    return new Promise(((resolve, reject) => {
      this.$axios.put(`/container`, data)
        .then(response => {
          if (response.status === 200) {
            context.commit("setSelectedContainer", response.data.container)
          }
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async deleteContainer(context,id){

    return new Promise(((resolve, reject) => {
      this.$axios.delete(`/container/${id}`)
        .then(response => {

            context.commit("deleteContainerById", id)

          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async toggleStatusContainer(context,data){
    const {id} = data;
    return new Promise(((resolve, reject) => {
      this.$axios.put(`/container/docker-container`, null, {
        params : {
          id
        }
      })
        .then(response => {
          resolve(response)
        }).catch(error => reject(error));
    }))
  },
  async createDockerContainer(context,id){
    return new Promise(((resolve, reject) => {
      this.$axios.post(`/container/docker-container`, null, {
        params : {
          id
        }
      })
        .then(response => {
          resolve(response)
        }).catch(error => reject(error));
    }))
  }

}
export const mutations = {
  setContainers(state,data){
    state.containers = data;
  },
  updateSpecificContainer(state,data){
    let updatedIndex = state.containers.findIndex((e) => e.id === data.id)
    state.containers[updatedIndex] = {...data};
  },
  setSelectedContainer(state,data){
    state.selectedContainer = data;
  },
  deleteContainerById(state,id){
    state.containers = [...state.containers.filter(container => container.id !== id)]
  }
}

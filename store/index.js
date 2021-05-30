export const state = () => ({
  list: [],
  loading: false,
})

export const mutations = {
  initList(state, payload) {
    state.list.push(payload)
  },
  add(state, payload) {
    const formatedCreateDate = formatDateFromTimestamp(payload.createDate)
    const formatedUpdateDate = formatDateFromTimestamp(payload.updateDate)
    const newPayload = {
      ...payload,
      updateDate: formatedUpdateDate,
      createDate: formatedCreateDate,
    }
    state.list.unshift(newPayload)
  },
  remove(state, payload) {
    const idx = state.list.indexOf(payload)
    state.list.splice(idx, 1)
  },
  update(state, payload) {
    state.list.splice(payload.idx, 1, payload)
  },

  toggleLoadingState(state, payload) {
    state.loading = payload
  },
}

export const getters = {
  loadingState: (state) => {
    return state.loading
  },
  getItem: (state) => (id) => {
    return state.list.find((item) => item.id === id)
  },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const ref = this.$fire.firestore.collection('list')
    try {
      const docs = await ref.orderBy('createDate', 'desc').get()
      docs.forEach((doc) => {
        const data = doc.data()
        const formatedupdateDate = formatDateFromTimestamp(data.updateDate)
        const formatedcreateDate = formatDateFromTimestamp(data.createDate)
        const formatedDoc = {
          id: doc.id,
          ...data,
          updateDate: formatedupdateDate,
          createDate: formatedcreateDate,
        }
        commit('initList', formatedDoc)
      })
    } catch (e) {
      commit('toggleLoadingState', false)
      return Promise.reject(e)
    }
  },
  async addDataToFireStore({ commit, state }, payload) {
    commit('toggleLoadingState', true)
    const { file, name, desc } = payload

    const listCollectionRef = this.$fire.firestore.collection('list')
    const date = this.$fireModule.firestore.FieldValue.serverTimestamp()
    const storageRef = this.$fire.storage.ref('album')
    const storageLocation = `${file.name} ${new Date().getTime()}`
    const fileRef = storageRef.child(storageLocation)

    try {
      await fileRef.put(payload.file)
      const url = await fileRef.getDownloadURL()
      const docRef = await listCollectionRef.add({
        name,
        desc,
        storageLocation,
        imgUrl: url,
        updateDate: date,
        createDate: date,
      })
      const doc = await docRef.get()
      const data = { id: doc.id, ...doc.data() }
      commit('add', data)
      commit('toggleLoadingState', false)
    } catch (e) {
      commit('toggleLoadingState', false)
      return Promise.reject(e)
    }
  },

  async updateDataToFireStore({ commit, state }, payload) {
    commit('toggleLoadingState', true)
    const { name, desc, id } = payload

    const listCollectionRef = this.$fire.firestore.collection('list')
    const date = this.$fireModule.firestore.FieldValue.serverTimestamp()
    listCollectionRef
      .doc(id)
      .update({
        name,
        desc,
        updateDate: date,
      })
      .then(() => {
        const idx = state.list.findIndex((item) => item.id === id)
        const formatedDate = new Date().toLocaleString('en-US')
        const updatedItem = {
          ...state.list[idx],
          name,
          desc,
          updateDate: formatedDate,
        }
        updatedItem.idx = idx
        commit('update', updatedItem)
        commit('toggleLoadingState', false)
      })
      .catch((e) => {
        commit('toggleLoadingState', false)
        return Promise.reject(e)
      })
  },
  async deleteDataFromFireStore({ commit, state }, payload) {
    commit('toggleLoadingState', true)
    const { id } = payload

    const listCollectionRef = this.$fire.firestore.collection('list')

    const storageRef = this.$fire.storage.ref('album')
    const fileRef = storageRef.child(payload.storageLocation)

    fileRef
      .delete()
      .then(() => listCollectionRef.doc(id).delete())
      .then(() => {
        const deleteItem = state.list.find((item) => item.id === id)
        commit('remove', deleteItem)
        commit('toggleLoadingState', false)
      })
      .catch((e) => {
        commit('toggleLoadingState', false)
        return Promise.reject(e)
      })
  },
}

const formatDateFromTimestamp = (timestamp) =>
  new Date(timestamp.seconds * 1000).toLocaleString('en-US')

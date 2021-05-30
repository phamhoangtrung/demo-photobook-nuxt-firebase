<template>
  <div class="row">
    <template v-for="item in list">
      <div class="col-6 col-md-4 col-lg-3 auto-height" :key="item.id">
        <div class="photo-outline" @click="showImageModal(item, $event)">
          <div class="tool">
            <span @click="deleteToFireStore(item, $event)" class="photo-button"
              ><i class="fas fa-times"></i
            ></span>
            <span
              @click="showUpdateFormModal(item, $event)"
              class="photo-button"
              ><i class="fas fa-pen"></i
            ></span>
            <span class="photo-button" @click="navigateToItemPage(item, $event)"
              ><i class="fas fa-eye"></i
            ></span>
          </div>

          <div
            class="photo"
            :style="{ backgroundImage: 'url(' + item.imgUrl + ')' }"
          >
            <p class="photo-name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </template>
    <!-- Form and add button -->
    <template>
      <photo-modal
        v-if="isShowImageModal"
        :name="showImage.name"
        :image="showImage.imgUrl"
        @close="hideImageModal"
      />
      <form-modal
        v-if="isShowUpdateForm"
        :type="'update'"
        @formSubmit="updateToFireStore"
        :name="showImage.name"
        :image="showImage.imgUrl"
        :desc="showImage.desc"
        :id="showImage.id"
        :loading="loading"
        @close="hideUpdateFormModal"
      />
      <form-modal
        :type="'create'"
        v-if="isShowCreateForm"
        @formSubmit="addToFireStore"
        :loading="loading"
        @close="hideCreateFormModal"
      />
      <v-dialog />
      <button
        @click="showCreateFormModal"
        class="btn btn-outline-success btn--add"
      >
        <i class="fas fa-plus"></i>
      </button>
    </template>
  </div>
</template>

<script>
import FormModal from '~/components/FormModal.vue'
export default {
  components: { FormModal },
  data() {
    return {
      isShowImageModal: false,
      isShowCreateForm: false,
      isShowUpdateForm: false,
      showImage: {},
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loadingState
    },
    list() {
      return this.$store.state.list
    },
  },
  methods: {
    showImageModal(item) {
      this.showImage = item
      this.isShowImageModal = true
    },
    hideImageModal() {
      this.isShowImageModal = false
    },
    showUpdateFormModal(item, event) {
      event.stopPropagation()
      this.isShowUpdateForm = true
      this.showImage = item
      // this.$modal.show('form-update-modal')
    },
    hideUpdateFormModal() {
      this.isShowUpdateForm = false
      // this.$modal.hide('form-update-modal')
    },
    showCreateFormModal(event) {
      event.stopPropagation()
      this.isShowCreateForm = true
    },
    hideCreateFormModal() {
      this.isShowCreateForm = false
    },
    updateToFireStore(data) {
      this.$store.dispatch('updateDataToFireStore', data)
    },
    addToFireStore(data) {
      this.$store.dispatch('addDataToFireStore', data)
    },
    deleteToFireStore(item, event) {
      event.stopPropagation()
      this.$modal.show('dialog', {
        title: 'Confirm before delete',
        text: `Are you want to delete this image: ${item.name}`,
        buttons: [
          {
            title: 'No',
            handler: () => {
              this.$modal.hide('dialog')
            },
          },
          {
            title: 'Yes',
            handler: () => {
              this.$store.dispatch('deleteDataFromFireStore', item)
            },
          },
        ],
      })
    },
    navigateToItemPage(item, event) {
      event.stopPropagation()
      this.$router.push(`/${item.id}`)
    },
  },
  watch: {
    loading(newloadingState) {
      if (newloadingState == false) {
        this.hideUpdateFormModal()
        this.hideCreateFormModal()
        this.$modal.hide('dialog')
      }
    },
  },
}
</script>

<style>
.auto-height {
  margin: 0 0 20px;
}
.photo {
  position: relative;
  width: 100%;
  height: 180px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
}

.photo-outline:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
.photo-name {
  position: absolute;
  height: 24px;
  background-color: white;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.photo-outline {
  padding: 5px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}
.photo-outline:hover .photo-button {
  display: flex;
}

.tool {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  z-index: 1;
}

.photo-button {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  cursor: pointer;
  display: none;
}
.photo-button > i {
  transition: transform 0.1s linear;
}
.photo-button:hover > i {
  transform: scale(1.1);
  color: #dc1962;
}

.vue-dialog-content-title {
  font-weight: 700;
  font-size: 18px;
}

.btn--add {
  position: fixed;
  right: 0;
  width: 60px;
  margin-right: 8px;
}
</style>


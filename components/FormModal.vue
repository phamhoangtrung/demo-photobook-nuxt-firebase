<template>
  <div class="modal--my center-item">
    <form @submit.prevent="checkForm" class="form-modal">
      <h1 class="form-nane">{{ type == 'create' ? 'create' : 'update' }}</h1>
      <div class="form-group">
        <label class="label" for="exampleInputPassword1">Name</label>
        <input
          type="text"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Ex: beautiful wallpaper"
          v-model="name"
          name="name"
        />
      </div>
      <div class="form-group">
        <label class="label" for="exampleInputPassword1">Description</label>
        <input
          type="text"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Ex: The best 4k background photo"
          v-model="desc"
          name="desc"
        />
      </div>
      <div class="form-group" v-if="type === 'create'">
        <p class="file-label label">Choose file</p>
        <div class="custom-file mb-3">
          <input
            style="cursor: pointer"
            @change="changeLable"
            type="file"
            class="custom-file-input"
            id="customFile"
            name="file"
          />
          <label class="custom-file-label" for="customFile">{{ label }}</label>
        </div>
        <img v-if="show" class="image" :src="fileSrc" :alt="fileName" />
      </div>
      <div class="form-group" v-else>
        <p class="file-label">Image:</p>
        <img class="image" :src="image" :alt="name" />
      </div>
      <div class="form-group d-flex justify-content-end">
        <button type="submit" class="btn btn-primary" :disabled="canSubmit">
          {{ type == 'create' ? 'create' : 'update' }}
        </button>
      </div>
    </form>
    <div class="modal-back" @click="close"></div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      file: '',
      label: 'Choose file',
      show: false,
    }
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },

  computed: {
    fileSrc() {
      return this.file ? URL.createObjectURL(this.file) : ''
    },
    fileName() {
      return this.file ? this.file.name : ''
    },
    canSubmit() {
      if (this.name == '') {
        return true
      } else if (this.desc == '') {
        return true
      } else if (this.file == '' && this.image == '') {
        return true
      } else if (this.loading == false) {
        return false
      } else {
        return true
      }
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    changeLable(e) {
      const target = e.currentTarget
      const fileName = target.value.split('\\').pop()
      const [file] = target.files
      if (file) {
        this.show = true
        this.file = file
      }
      this.label = fileName
    },
    checkForm() {
      const formValue = {
        id: this.id,
        name: this.name,
        desc: this.desc,
        file: this.file,
      }
      this.$emit('formSubmit', formValue)
    },
  },
}
</script>

<style>
.file-label {
  margin: 0 0 8px 0;
}
.image {
  display: block;
  margin: 0 auto;
  height: 200px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
}
.btn {
  text-transform: uppercase;
}
.label {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
}
.form-group {
  margin-bottom: 10px;
}
.form-nane {
  text-transform: uppercase;
  text-align: center;
  border-bottom: 1px solid #000;
  padding-bottom: 10px;
}
.modal--my {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.form-modal {
  z-index: 1;
  background: white;
  border-radius: 2px;
  box-shadow: 0 20px 60px -2px rgb(27 33 58 / 40%);
  border: 3px solid white;
  width: 40%;
  padding: 10px 20px;
}

.modal-back {
  position:absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  /* transition: opacity 0.3s ease; */
}
</style>

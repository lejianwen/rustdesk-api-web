<template>
  <div class="upload-order-file">
    <el-upload
            size="mini"
            ref="upload"
            :on-success="fileUploadSuccess"
            :before-upload="beforeFileUpload"
            :on-preview="onPreview"
            :on-remove="fileRemove"
            :on-error="onError"
            name="file"
            :file-list="fileList"
            :action="fileUploadHost"
            :data="fileUploadData"
            :headers="headers"
            list-type="picture-card"
            :limit="0"
            accept="image/*"
    >
      <template #default>
        <div class="default-slot">
          <slot name="default">
            <el-icon class="default-icon">
              <plus/>
            </el-icon>
          </slot>
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="showPreview" top="5vh">
      <el-image :src="showImage" class="preview-image" fit="contain"></el-image>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent, ref, computed, reactive, unref, readonly, toRefs } from 'vue'
  import { Plus, ZoomIn, Delete, ArrowLeft, ArrowRight, Check } from '@element-plus/icons'
  import { useOss } from '@/components/form/upload/oss'
  import { ElMessage } from 'element-plus'
  import { useLocal } from '@/components/form/upload/local'

  export default defineComponent({
    name: 'imageUpload',
    props: {
      limit: {
        type: Number,
        default: 0,
      },
      beforeUpload: {
        type: Function,
        default: function () {
          return true
        },
      },
      host: {
        type: String,
        default: import.meta.env.VITE_BASE_API + '/file/upload',
      },
      modelValue: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'local', //local oss
      },
      width: {
        type: String,
        default: '148px',
      },
    },
    components: { Plus, ZoomIn, Delete, ArrowLeft, ArrowRight, Check },
    setup (props, context) {
      const showPreview = ref(false)
      const showImage = ref('')

      let fileList = computed(() => props.modelValue ? [{ url: props.modelValue, status: 'success' }] : [])

      let fileUpload = reactive({
        fileUploadHost: '',
        fileUploadData: {},
        beforeFileUpload: null,
        headers: {},
      })

      if (props.type === 'oss') {
        fileUpload = useOss(props.beforeUpload, props.multiple)
      } else {
        fileUpload = useLocal(props.beforeUpload, props.host)
      }

      function removeImage (file) {
        let fList = unref(fileList)
        const index = fList.findIndex(f => f.url === file.url)
        fList.splice(index, 1)
        updateValue(fList)
      }

      function updateValue (_fileList) {
        let fList = unref(_fileList)
        context.emit(
          'update:modelValue',
          fList.length ? fList[0].url : '',
        )
      }

      function fileRemove (file, _fileList) {
        updateValue(_fileList)
      }

      function onError () {

      }

      function fileUploadSuccess (response, file, _fileList) {
        file.url = response?.data?.url || file.url
        if (_fileList.length > 1) {
          _fileList.splice(0, 1)
        }
        if (_fileList.every(f => f.status === 'success')) {
          updateValue(_fileList)
        }
      }

      function onPreview (file) {
        showImage.value = file.url
        showPreview.value = true
      }

      return {
        fileList,

        ...toRefs(fileUpload),

        fileRemove,
        onError,
        fileUploadSuccess,

        onPreview,
        removeImage,

        showPreview,
        showImage,
      }
    },
  })
</script>

<style scoped lang="scss">
  .upload-order-file {

    ::v-deep(.el-upload-list__item-thumbnail) {
      object-fit: contain;

    }

    ::v-deep(.el-upload--picture-card) {
      width: v-bind(width);
      height: v-bind(width);
    }

    ::v-deep(.el-upload-list__item) {
      width: v-bind(width);
      height: v-bind(width);
    }

    ::v-deep(.el-progress) {
      width: v-bind(width) !important;
      height: v-bind(width) !important;
    }

    ::v-deep(.el-progress-circle) {
      width: v-bind(width) !important;
      height: v-bind(width) !important;
    }


    .default-slot {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .default-icon {
        margin-top: 0;
      }
    }
  }

  .preview-image {
    width: 100%;

    ::v-deep(img) {
      max-height: 700px;
    }
  }
</style>

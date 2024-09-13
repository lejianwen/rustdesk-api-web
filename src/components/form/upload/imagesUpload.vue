<template>
  <div class="upload-order-file">
    <el-upload
            ref="upload"
            :on-success="fileUploadSuccess"
            :before-upload="beforeFileUpload"
            :on-remove="fileRemove"
            :on-exceed="onExceed"
            :on-error="onError"
            name="file"
            :multiple="multiple"
            :file-list="fileList"
            :action="fileUploadHost"
            :data="fileUploadData"
            :headers="headers"
            list-type="picture-card"
            :limit="limit"
            accept="image/*"
            :drag="drag"
    >
      <template #default>
        <div class="default-slot">
          <slot name="default">
            <div>
              <el-icon class="default-icon">
                <plus/>
              </el-icon>
              <div class="drag-tips">点击上传<span v-if="drag">或直接拖入文件</span></div>
            </div>
          </slot>
        </div>
      </template>
      <template #file="{file}">
        <img
                v-if="file.status === 'success'"
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
        >
        <label class="el-upload-list__item-status-label">
          <el-icon color="white">
            <check/>
          </el-icon>
        </label>
        <el-progress
                v-if="file.status === 'uploading'"
                type="circle"
                :stroke-width="6"
                :percentage="parseInt(file.percentage)"
        />
        <span v-else-if="file.status === 'success'" class="el-upload-list__item-actions">
          <el-icon class="el-upload-list__item-icon" @click="leftImage(file)"><arrow-left/></el-icon>
          <el-icon class="el-upload-list__item-icon" @click="removeImage(file)"><Delete/></el-icon>
          <el-icon class="el-upload-list__item-icon" @click="rightImage(file)"><arrow-right/></el-icon>
        </span>
      </template>
    </el-upload>
  </div>
</template>
<script>
  import { defineComponent, ref, computed, reactive, unref, readonly, toRefs } from 'vue'
  import { Plus, ZoomIn, Delete, ArrowLeft, ArrowRight, Check } from '@element-plus/icons'
  import { useOss } from '@/components/form/upload/oss'
  import { ElMessage } from 'element-plus'
  import { useLocal } from '@/components/form/upload/local'

  export default defineComponent({
    name: 'imagesUpload',
    props: {
      drag: {
        type: Boolean,
        default: false,
      },
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
        type: Array,
        default: function () {
          return []
        },
      },
      type: {
        type: String,
        default: 'local', //local oss
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      width: {
        type: String,
        default: '148px',
      },
    },
    components: { Plus, ZoomIn, Delete, ArrowLeft, ArrowRight, Check },
    setup (props, context) {

      let fileList = computed(() => props.modelValue.map(url => { return { url, status: 'success' } }))

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

      function leftImage (file) {
        let fList = unref(fileList)
        const index = fList.findIndex(f => f.url === file.url)
        if (index === 0 || index === -1) {
          return
        }
        fList[index] = fList.splice(index - 1, 1, fList[index])[0]
        updateValue(fList)
      }

      function rightImage (file) {
        let fList = unref(fileList)
        const index = fList.findIndex(f => f.url === file.url)
        if (index === fList.length - 1 || index === -1) {
          return
        }
        fList[index] = fList.splice(index + 1, 1, fList[index])[0]
        updateValue(fList)
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
          fList.filter(f => f.status === 'success').map(file => file.url),
        )
      }

      function fileRemove (file, _fileList) {
        updateValue(_fileList)
      }

      function onError () {

      }

      function fileUploadSuccess (response, file, _fileList) {
        file.url = response?.data?.url || file.url
        if (_fileList.every(f => f.status === 'success')) {
          updateValue(_fileList)
        }
      }

      function onExceed () {
        ElMessage.error('超出数量限制')
      }

      return {
        fileList,

        ...toRefs(fileUpload),

        onExceed,
        fileRemove,
        onError,
        fileUploadSuccess,

        leftImage,
        rightImage,
        removeImage,
      }
    },
  })
</script>

<style scoped lang="scss">
  .upload-order-file {
    ::v-deep(.el-upload-dragger) {
      border: none;
      width: 100%;
      height: 100%;
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

    .drag-tips {
      font-size: 12px;
      color: #999;
    }


    ::v-deep(.el-upload-list__item) {
      transition: none !important;
    }

    ::v-deep(.el-upload-list) {
      transition: none !important;
    }

    .el-upload-list__item-thumbnail {
      object-fit: contain;
    }

    .el-upload-list__item-actions {
      display: flex;
      justify-content: space-around;
      align-items: center;

      &:after {
        display: none;
      }

      .el-upload-list__item-icon {
        cursor: pointer;
        font-size: 20px;
        color: #fff;
      }
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

</style>

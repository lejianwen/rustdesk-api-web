<template>
  <el-form ref="shareform" :model="formData" label-width="120px" label-suffix=" :">
    <el-form-item :label="T('ID')" prop="id" required>
      {{ formData.id }}
    </el-form-item>
    <!--    <el-form-item :label="T('PasswordType')">
          <div>
            <el-radio-group v-model="formData.password_type" @change="changePwdType">
              <el-radio value="once">{{ T('OncePassword') }}</el-radio>
              <el-radio value="fixed">{{ T('FixedPassword') }}</el-radio>
            </el-radio-group>
            <div v-if="formData.password_type==='fixed'" style="color: red">
              {{ T('FixedPasswordWarning') }}
            </div>
          </div>
        </el-form-item>-->
    <el-form-item :label="T('Password')" prop="password" required>
      <el-input v-model="formData.password" type="password" show-password></el-input>
    </el-form-item>
    <el-form-item :label="T('ExpireTime')" prop="expire" required>
      <el-select v-model="formData.expire">
        <el-option
            v-for="item in expireTimes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="link" :label="T('Link')">
      <el-input v-model="link" readonly>
        <template #append>
          <el-button :icon="CopyDocument" @click="copyLink"/>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button v-if="!link" @click="cancel">{{ T('Cancel') }}</el-button>
      <el-button v-if="!link" :loading="loading" @click="submitShare" type="primary">{{ T('Submit') }}</el-button>
      <el-button v-else @click="cancel" type="success">{{ T('Close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { T } from '@/utils/i18n'
  import { computed, reactive, ref, watch } from 'vue'
  import { getV2ShareUrl } from '@/utils/webclient'
  import * as sha256 from 'fast-sha256'
  import { shareByWebClient } from '@/api/address_book'
  import { CopyDocument } from '@element-plus/icons'
  import { handleClipboard } from '@/utils/clipboard'
  import { ElMessageBox } from 'element-plus'

  const props = defineProps({
    id: String,
    hash: String,
  })
  const emits = defineEmits(['cancel', 'success'])
  const formData = reactive({
    id: props.id,
    password_type: 'once',
    password: '',
    expire: 1800,
    hash: props.hash,
  })
  watch(() => props.id, () => {
    init()
  })
  const init = () => {
    console.log('init')
    formData.id = props.id
    formData.hash = props.hash
    formData.password = ''
    formData.expire = 1800
    formData.password_type = 'once'
    link.value = ''
  }
  const link = ref('')
  const expireTimes = computed(() => [
    { label: T('Minutes', { param: 5 }, 5), value: 300 },
    { label: T('Minutes', { param: 30 }, 30), value: 1800 },
    { label: T('Hours', { param: 1 }, 1), value: 3600 },
    { label: T('Days', { param: 1 }, 1), value: 86400 },
    { label: T('Weeks', { param: 1 }, 1), value: 604800 },
    { label: T('Months', { param: 1 }, 1), value: 2592000 },
    { label: T('Forever'), value: 0 },
  ])
  const changePwdType = (val) => {
    if (val === 'fixed' && !formData.password) {
      formData.password = props.hash
    }
    if (val === 'once') {
      formData.password = ''
    }
  }
  const cancel = () => {
    loading.value = false
    emits('cancel')
    init()
  }
  const loading = ref(false)
  const submitShare = async () => {
    if (!formData.password) {
      return
    }
    loading.value = true
    const _formData = { ...formData }
    /*if (formData.password !== formData.hash) {
      const res = await getPeerSlat(formData.id).catch(e => {
        ElMessageBox.alert(T('Timeout'), T('Error'))
        return false
      })
      if (!res) {
        loading.value = false
        return
      }
      const p = hash([formData.password, res.salt])
      _formData.password = btoa(p.toString().split(',').map((v) => String.fromCharCode(v)).join(''))
    }*/
    const res = await shareByWebClient(_formData).catch(_ => false)
    if (res) {
      link.value = getV2ShareUrl(res.data.share_token)
      emits('success')
    }
    loading.value = false
  }

  const copyLink = (e) => {
    handleClipboard(link.value, e)
  }

  const hash = (datas) => {
    const hasher = new sha256.Hash()
    datas.forEach((data) => {
      if (typeof data == 'string') {
        data = new TextEncoder().encode(data)
      }
      hasher.update(data)
    })
    return hasher.digest()
  }

</script>

<style scoped lang="scss">

</style>

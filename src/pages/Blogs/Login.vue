<template>
  <el-card class="login-card">
    <h2 class="login-title">Login</h2>
    <el-form :model="form" label-width="100px">
      <el-form-item label="Email">
        <el-input v-model="form.email" type="email" placeholder="Enter your email" />
      </el-form-item>

      <el-form-item label="Username">
        <el-input v-model="form.username" placeholder="Enter your username" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitLogin">Login</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import $api from '@/services/api.js'
import { jwtDecode } from 'jwt-decode'

import {useRouter} from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  email: '',
})

const submitLogin = async () => {
  try {
    const response = await $api.post('/api/Auth/Post/authenticate', form.value)
    console.log('Login successful:', response.data)
    localStorage.setItem('token', response.data.accessToken)
    const decodedToken = jwtDecode(response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(decodedToken))
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}
</style>

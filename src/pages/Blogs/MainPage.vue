<template>
  <div class="blog-container">
    <header class="blog-header">
      <h1>MyBlog.uz</h1>
      <p class="subtitle">Shaxsiy blog</p>
    </header>

    <div class="main-content">
      <div class="categories">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="Dasturlash" name="programming"></el-tab-pane>
          <el-tab-pane label="Shaxsiy" name="personal"></el-tab-pane>
          <el-tab-pane label="Talim" name="education"></el-tab-pane>
          <el-tab-pane label="Texnologiya" name="technology"></el-tab-pane>
          <el-tab-pane label="Umumiy" name="general"></el-tab-pane>
        </el-tabs>
      </div>

      <div class="content-grid">
        <div class="left-column">
          <div class="post-card relative" v-for="post in blogs" :key="post.id">
            <div class="flex flex-row gap-2 relative">
              <el-dropdown class="dots" >
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editItem(post)">Edit</el-dropdown-item>
                    <el-dropdown-item @click="deleteItem(post)">Delete</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <img :src="`https://myblogx-a8gdavgwhhcyh7h7.canadacentral-01.azurewebsites.net/${post.coverImage}`" :alt="post.title" class="post-image" />
              <div>
                <h3>{{ post.title }}</h3>
                <p class="post-date">{{ formatDate(post.createdAt) }}</p>
                <p class="post-content">
                  {{ post.content }}
                </p>
              </div>

              <div class="comment-btn" @click="toggleComments(post.id)">
                <el-icon><ChatDotRound class="w-1.5" /></el-icon>
              </div>
            </div>
            <Comments :post="post" v-if="showComments.postId == post.id"/>


          </div>

        </div>

        <div class="right-column">
          <div class="w-full">
            <el-button @click="openPostForm" class="w-full" type="success">
              <el-icon class="mr-1"><Plus /></el-icon> Add a new post
            </el-button>
          </div>
          <div class="social-section">
            <h4>Men ijtimoiy tarmoqlarda</h4>
            <el-divider></el-divider>
            <el-button type="primary" plain icon="el-icon-chat-dot-round">Aloqa</el-button>
            <el-button type="primary" plain icon="el-icon-s-promotion">Telegram</el-button>
            <el-button type="primary" plain icon="el-icon-more">Boshqa</el-button>
          </div>

          <div class="links-section">
            <h4>Dasturlash haqida blog</h4>
            <el-divider></el-divider>
            <el-link type="primary" :underline="false">Dasturlash asoslari</el-link><br />
            <el-link type="primary" :underline="false">Vue.js darsliklari</el-link><br />
            <el-link type="primary" :underline="false">Algoritmlar</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="Create New Post" width="500px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="Title (Uzbek)" required>
        <el-input v-model="form.titleUz" placeholder="Enter Uzbek title" />
      </el-form-item>

      <el-form-item label="Title (English)">
        <el-input v-model="form.titleEng" placeholder="Enter English title" />
      </el-form-item>

      <el-form-item label="Title (Turkish)">
        <el-input v-model="form.titleTr" placeholder="Enter Turkish title" />
      </el-form-item>

      <el-form-item label="Title (Russian)">
        <el-input v-model="form.titleRu" placeholder="Enter Russian title" />
      </el-form-item>

      <el-form-item label="Content (Uzbek)" required>
        <el-input v-model="form.contentUz" type="textarea" placeholder="Enter Uzbek content" />
      </el-form-item>

      <el-form-item label="Content (English)">
        <el-input v-model="form.contentEng" type="textarea" placeholder="Enter English content" />
      </el-form-item>

      <el-form-item label="Content (Turkish)">
        <el-input v-model="form.contentTr" type="textarea" placeholder="Enter Turkish content" />
      </el-form-item>

      <el-form-item label="Content (Russian)">
        <el-input v-model="form.contentRu" type="textarea" placeholder="Enter Russian content" />
      </el-form-item>

      <el-form-item label="Cover Image">
        <el-upload
          class="upload-demo"
          action="#"
          :limit="1"
          :on-change="handleFileChange"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button type="primary">Upload Image</el-button>
        </el-upload>
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Image Preview" />
        </div>
      </el-form-item>

      <el-form-item label="Published">
        <el-switch v-model="form.isPublished" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Submit</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted , watch} from 'vue'
import { Plus, MoreFilled, ChatDotRound } from '@element-plus/icons-vue'

import { useBlogMainPage } from '@/composables/useBlogMainPage'

const { blogs, loading, error, fetchBlogs, deleteItem, editItem, form,
  dialogVisible, openPostForm } = useBlogMainPage()

const userInformation = JSON.parse(localStorage.getItem('user'))

import { ElLoading, ElMessage } from 'element-plus'
import api from '@/services/api.js'
import { jwtDecode } from 'jwt-decode'

import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import Comments from '@/components/Comments.vue'

const router = useRouter()

const activeTab = ref(0)
const showComments = ref({});
const newComment = ref({});

const fileList = ref([])
const imagePreview = ref(null)

function toggleComments(postId) {
  if (postId == showComments.value.postId) {
    showComments.value.postId = null
    return
  }
  showComments.value.postId = postId;
}

function addComment(postId) {
  const comment = newComment.value[postId]?.trim();
  if (!comment) return;

  const post = blogs.find(p => p.id === postId);
  if (post) {
    post.comments.push({ id: Date.now(), author: 'You', content: comment });
    newComment.value[postId] = ''; // Clear input field
  }
}

const handleFileChange = (file) => {
  fileList.value = [file]
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const formatDate = (timestamp) => {
  return dayjs(timestamp).format('dddd, MMMM D, YYYY [at] h:mm A')
}

const updatePost = async ()=>{
  const formData = new FormData()
  formData.append('Title.Eng', form.value.titleEng)
  formData.append('Title.Tr', form.value.titleTr)
  formData.append('Title.Ru', form.value.titleRu)
  formData.append('Title.Uz', form.value.titleUz)
  formData.append('Content.Eng', form.value.contentEng)
  formData.append('Content.Tr', form.value.contentTr)
  formData.append('Content.Ru', form.value.contentRu)
  formData.append('Content.Uz', form.value.contentUz)
  formData.append('IsPublished', form.value.isPublished)
  formData.append('UserId', form.value.userId)
  if (fileList.value.length) {
    formData.append('CoverImage', fileList.value[0].raw)
  }


  try {
    await api.put(`/api/Posts/Update/${form.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    ElMessage({
      type: 'success',
      text: 'Updated Successfully'
    })
    dialogVisible.value = false
    window.location.reload()
  } catch (error) {
    console.error('Error creating post:', error)
  }
}

const submitForm = async () => {
  if (form.value.id){
    updatePost()
    return
  }

  const formData = new FormData()
  formData.append('Title.Eng', form.value.titleEng)
  formData.append('Title.Tr', form.value.titleTr)
  formData.append('Title.Ru', form.value.titleRu)
  formData.append('Title.Uz', form.value.titleUz)
  formData.append('Content.Eng', form.value.contentEng)
  formData.append('Content.Tr', form.value.contentTr)
  formData.append('Content.Ru', form.value.contentRu)
  formData.append('Content.Uz', form.value.contentUz)
  formData.append('IsPublished', form.value.isPublished)
  formData.append('UserId', form.value.userId)

  if (fileList.value.length) {
    formData.append('CoverImage', fileList.value[0].raw)
  }

  try {
    await api.post('/api/Posts/Insert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('Post created successfully')
    dialogVisible.value = false
  } catch (error) {
    console.error('Error creating post:', error)
  }
}



const showToast = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  })
}

const elLoading = ElLoading.service({
  lock: true,
  text: 'Loading',
  background: 'rgba(0, 0, 0, 0.7)',
})

onMounted(async () => {
  await fetchBlogs()
})

watch(loading, (newValue) => {
  if (newValue) {
    ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  } else {
    elLoading.close()
  }
})

</script>

<style scoped>
.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.blog-header {
  text-align: center;
  margin-bottom: 30px;
}

.blog-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 5px;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.post-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

}

.post-card img {
  width: 300px;
  height: 250px;
  object-fit: cover;
}

.post-card h3 {
  color: #409eff;
  margin-top: 0;
}

.post-date {
  color: #909399;
  font-size: 0.9rem;
  margin: 10px 0;
}

.post-content {
  color: #606266;
  line-height: 1.6;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.social-section,
.links-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.social-section h4,
.links-section h4 {
  margin-top: 0;
  color: #409eff;
}

.featured-post {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  margin-top: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.featured-post h2 {
  color: #409eff;
  margin-top: 0;
}

.el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-link {
  margin-bottom: 8px;
  display: inline-block;
}
.dialog-footer {
  text-align: right;
}

.comment-btn{
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  user-select: none;
}

.comment-btn i{
  width: 32px !important;
}

.comment-btn svg{
  width: 32px !important;
  height: 32px !important;
}

</style>

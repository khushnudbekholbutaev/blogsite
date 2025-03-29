import { ref } from 'vue';
import api from '@/services/api';
import {useRouter} from 'vue-router'
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { ElMessage, ElLoading } from 'element-plus'
import { jwtDecode } from 'jwt-decode'


export function useBlogMainPage() {
  const blogs = ref([]);
  const loading = ref(false);
  const error = ref('');
  const dialogVisible = ref(false);

  const router = useRouter();

  const form = ref({
    id: null,
    titleEng: '',
    titleTr: '',
    titleRu: '',
    titleUz: '',
    contentEng: '',
    contentTr: '',
    contentRu: '',
    contentUz: '',
    isPublished: true,
    userId: JSON.parse(localStorage.getItem('user')).Id,
  })

  async function editItem(post) {
    console.log("post", post)
    try {
      const response = await api.get(`/api/Posts/GetById/${post.id}?language=uz`);
       form.value = {
        id: response.data.content.id,
        titleEng: response.data.content.title.eng,
        titleTr: response.data.content.title.tr,
        titleRu: response.data.content.title.ru,
        titleUz: response.data.content.title.uz,
        contentEng: response.data.content.content.eng,
        contentTr: response.data.content.content.tr,
        contentRu: response.data.content.content.ru,
        contentUz: response.data.content.content.uz,
        isPublished: response.data.content.isPublished,
        userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).Id : null,
      }
      console.log("form", form.value)
      openPostForm()
    }catch(err) {
      console.log(err);
    }

  }

  const openPostForm = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.log('Token has expired')
        router.push('/login')
      } else {
        console.log('Token is valid, proceed with the post form')
        dialogVisible.value = true
      }
    } catch (error) {
      router.push('/login')
      console.log(error)
    }
  }


  async function deleteItem(post){
    try {
      const response = await api.delete(`/api/Posts/Delete/${post.id}`)
      console.log("response", response)
      ElMessage({
        message: 'Post deleted successfully.',
        type: 'warning',
      })
      await fetchBlogs()
    }catch(error){
      console.log(error)
    }
  }
  async function fetchBlogs() {
    loading.value = true;
    error.value = '';
    blogs.value = []

    try {
      const response = await api.get(API_ENDPOINTS.POSTS+'?language=uz' );
      console.log("response", response)
      blogs.value = response.data.content;
      loading.value = false;
    } catch (err) {

    } finally {
      loading.value = false;
    }
  }

  return { blogs, loading, form, error, dialogVisible, fetchBlogs, deleteItem ,editItem , openPostForm};
}

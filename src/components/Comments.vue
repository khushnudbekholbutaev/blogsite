<template>
  <div class="comments">
    <h2>Comments</h2>
    <div class="comments-form">
      <form @submit.prevent="submitComment">
        <ul>
          <li>
            <textarea v-model="comment" placeholder="Comment" required></textarea>
          </li>
          <li>
            <input type="submit" value="Post" />
          </li>
        </ul>
      </form>
    </div>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.time" class="comment">
        <h4>{{ comment.username }} says</h4>
        <p class="timestamp">{{ comment.time }}</p>
        <p>{{ comment.comment }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const comments = ref([]);
const username = ref('');
const comment = ref('');


</script>

<style scoped>
@import url('https://rsms.me/inter/inter.css');

html, body {
  height: 100%;
  margin: 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-image: radial-gradient(#79F1A4, #0E5CAD);
}

#app {
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  margin: 100px 0 30px 0;
}

.comments {
  width: 100%;
  max-width: 100%;
  min-width: 300px;
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.comments h2 {
  font-size: 2.3em;
  margin-bottom: 0;
}

.comments-form {
  border-bottom: 1px solid #ccc;
}

.comments-form ul {
  list-style: none;
  padding-left: 0;
}

.comments-form li {
  margin-bottom: 15px;
}

.comments-form input[type='submit'] {
  border: 0;
  border-radius: 30px;
  padding: 7px 16px;
  background: #448ef6;
  color: #fff;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  font-size: 0.9em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.comments-form input[type='text'],
.comments-form textarea {
  padding: 10px;
  border: 0;
  border-radius: 10px;
  background: #f7f7f7;
}

.comments-form input::placeholder,
.comments-form textarea::placeholder {
  font-family: 'Rubik', sans-serif;
}

.comments-form input:focus,
.comments-form textarea:focus {
  background: #fff;
}

.comments-form textarea {
  width: 80%;
  height: 80px;
  resize: none;
}

.comments-list {
  margin-top: 20px;
}

.comment {
  position: relative;
  padding: 10px 20px;
  background: #efefef;
  border-radius: 10px;
  margin-bottom: 15px;
}

.comment .timestamp {
  color: #777;
  position: absolute;
  right: 20px;
  top: 10px;
}

.comment h4, .comment p {
  margin: 10px;
}

footer {
  float: right;
  color: #777;
  font-size: 0.8em;
  margin-top: 15px;
}

</style>

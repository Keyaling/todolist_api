<script setup>
import { ref,onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router'

import { useLoading } from 'vue-loading-overlay' ;

// const fullPage = ref(true)
// const onCancel = ref(false)
// const formContainer = ref(null)
const $loading = useLoading({
  // options
    color: '#ffd370',                  // loading畫面的顏色
    backgroundColor: 'white',       // 背景顏色
    opacity: 0.8,                   // 透明度
    blur: '10px',                   // 背景模糊效果
    zIndex: 9999                    // loading畫面的層級
})

const router =useRouter();

const api = "https://todolist-api.hexschool.io";
// 登入
const signInField =ref({
    email: "",
    password: ""
})
const signInRes=ref("");
const signIn = async () => {
    // console.log("signInRes:",signInRes.value);
    const loader = $loading.show({   
        canCancel: true,
    })
    try {
        const res = await axios.post(`${api}/users/sign_in`, signInField.value);
        console.log(res.data);
        // expires=${new Date(res.data.exp)}
        document.cookie = `customTodoToken=${res.data.token};SameSite=None; Secure`;
        signInRes.value = res.data.token;
        setTimeout(()=>{
          loader.hide();
        },100)
        Swal.fire({
            position: "center",
            icon: "success",
            title: `${res.data.nickname}您已成功登入`,
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(()=>{
          router.push('/todolist');

        },1000)
        
    } catch (error) {
        // console.log(error.response.data);
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
        });
    }

}

</script>
<template>
<!-- login_page -->
<div id="loginPage" class="bg-yellow">
  <div class="container loginPage vhContainer ">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
    </div>
    <div>
      <VForm class="formControls">
        <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
    <!-- 登入帳號 -->
        <label class="formControls_label" for="email">Email</label>
        <VField id="email" name="email" type="email"  rules="required|email" class="formControls_input" placeholder="請輸入 Email" v-model="signInField.email"/>
        <ErrorMessage name="email"/>
    <!-- 登入密碼 -->
        <label class="formControls_label" for="password">密碼</label>
        <VField class="formControls_input" type="password" name="密碼"  rules="required|min:6" id="password" placeholder="請輸入密碼" v-model="signInField.password" />
        <ErrorMessage name="密碼"/>
        <input class="formControls_btnSubmit" type="button" @click="signIn" value="登入">
        <RouterLink to="/" class="formControls_btnLink">註冊帳號</RouterLink>
      </VForm>
    </div>
  </div>
</div>
</template>

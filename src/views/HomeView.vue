<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRoute ,useRouter } from 'vue-router'
import { ref} from 'vue';


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

const route =useRoute();
const router =useRouter();
console.log(route,router)
const api = "https://todolist-api.hexschool.io";
// 註冊
const email = ref("");
const nickname = ref("");
const firstPwd = ref("");
const confirmPwd = ref("");


// const signupRes=ref("");


const signUp = async () => {
    const loader = $loading.show({   
          canCancel: true,
    })
    if (firstPwd.value === confirmPwd.value) {
        try {
            await axios.post(`${api}/users/sign_up`, {
                email: email.value,
                password: confirmPwd.value,
                nickname: nickname.value
            })
            loader.hide();
            Swal.fire("恭喜您已註冊成功!");
            setTimeout(() => {
              router.push('/login');

            }, 2000);

        } catch (error) {
            //console.log(error.response.data.message)
            Swal.fire({
                title: '系統警告',
                text: error.response.data.message,
                icon: 'warning',
                confirmButtonText: '確認'
            })
        }

    } else {
        Swal.fire({
            title: '系統警告',
            text: '密碼不一致',
            icon: 'warning',
            confirmButtonText: '確認'
        })

    }
}
</script>

<template>
<!-- sign up -->
<div id="signUpPage" class="bg-yellow">
  <div class="container signUpPage vhContainer">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
    </div>
    <div>
      <VForm class="formControls">
          <h2 class="formControls_txt">註冊帳號</h2>
    <!-- 註冊Email -->
          <label class="formControls_label" for="email">Email</label>
          <!-- <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="email"> -->
          <VField id="email" name="email" type="email"  rules="required|email" class="formControls_input" placeholder="請輸入 Email" v-model="email"/>
          <ErrorMessage name="email"/>
    <!-- 註冊暱稱 -->
          <label class="formControls_label" for="name">您的暱稱</label>
          <!-- <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" v-model="nickname"> -->
          <VField type="text" name="暱稱" id="name" placeholder="請輸入您的暱稱" v-model="nickname"  rules="required" class="formControls_input"/>
          <ErrorMessage name="暱稱"/>
    <!-- 註冊密碼 -->
          <label class="formControls_label" for="firstpwd">密碼</label>
          <!-- <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="firstPwd" > -->
          <VField class="formControls_input" type="password" name="密碼"  rules="required|min:6" id="firstpwd" placeholder="請輸入密碼" v-model="firstPwd" />
          <ErrorMessage name="密碼"/>
    <!-- 確認註冊密碼 -->
          <label class="formControls_label" for="confirmpwd">再次輸入密碼</label>
          <!-- <input class="formControls_input" type="password" name="confirmpwd" id="confirmpwd" placeholder="請再次輸入密碼" required v-model="confirmPwd"> -->
          <VField class="formControls_input" type="password" name="再次輸入密碼" id="confirmpwd"  rules="required|min:6" placeholder="請輸入密碼" v-model="confirmPwd" />
          <ErrorMessage name="再次輸入密碼"/>
          <!-- <input class="formControls_btnSubmit" type="button" onclick="javascript:location.href='#todoListPage'" value="註冊帳號"> -->
          <input class="formControls_btnSubmit" type="button" value="註冊帳號" @click="signUp" >
          <!-- <a class="formControls_btnLink" href="#loginPage">登入</a> -->
          <RouterLink to="/login" class="formControls_btnLink">登入</RouterLink>
      </VForm>
    </div>
  </div>

</div>
</template>
<style>


</style>
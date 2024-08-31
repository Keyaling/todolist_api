<script setup>

import { ref ,onMounted ,computed,inject} from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

import { useLoading } from 'vue-loading-overlay' ;

// const fullPage = ref(true);
// const onCancel = ref(false);
// const formContainer = ref(null);
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

// 驗證登入
//屬於自動觸發，要使用 onMounted
const user = ref({
    nickname:"",
    uid:""
})

const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)customTodoToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
    );
onMounted(async ( )=> {

    
    // const token = document.cookie.replace(
    //     /(?:(?:^|.*;\s*)customTodoToken\s*\=\s*([^;]*).*$)|^.*$/,
    //     "$1",
    // );
    // console.log(token);
    if(!token){
        Swal.fire({
            icon: "error",
            title: "您尚無資格登入",
            text: "Something went wrong!"
        });
        router.push("/login");
        return
    };
    const loader = $loading.show({   
        // Optional parameters
        // container: fullPage.value ? null : formContainer.value,
        canCancel: true,
        // onCancel: onCancel.value
    })
    try {
            const res = await axios.get(`${api}/users/checkout`, {
                headers: {
                    Authorization: token,
                }
            });
            user.value=res.data;
            loader.hide();
            getTodoList();

            // console.log("ueser:",user.value,"token:",token);
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "驗證失效",
            text: "Something went wrong!"
        });
        setTimeout(()=>{
            router.push("/login");
        },3000);
    }


})

// 代辦清單
//1.取得代辦清單
const todoList=ref([]);//查看api得出的data是個[]。

const getTodoList = async () => {

    try {
        const response = await axios.get(`${api}/todos`, {
            headers: {
            Authorization: token,
            }
        });
        todoList.value = response.data.data;

    } catch (error) {
        // console.log(error.message);
        Swal.fire(error.response.data.message);
    }
    
};


// 2.新增代辦事項
const newTodoItem = ref("");
const addTodoItem = async () => {
    if(newTodoItem.value===""){
        Swal.fire("清單內容不能為空的");
        return
    };
    const newTodo = {
        content: newTodoItem.value,
    };

    try {
        const res = await axios.post(`${api}/todos/`,newTodo, {
            headers: {
                Authorization: token,
            }
        });
        // console.log(res);
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
            });
            Toast.fire({
            icon: "success",
            title: "已新增代辦清單"
        });
        
    } catch (error) {
        // console.log(error);
        Swal.fire(error.response.data.message);
    }
    newTodoItem.value = '';
    getTodoList();
    setKindTag("all");
}

// 3.更改代辦清單狀態(status)
const toggleTodoItem = async (id) => {
    // console.log("更改代辦清單狀態",id)
    const loader = $loading.show({   
        // Optional parameters
        // container: fullPage.value ? null : formContainer.value,
        canCancel: true,
        // onCancel: onCancel.value
    })
    try {
        await axios.patch(`${api}/todos/${id}/toggle`,{}, {
            headers: {
                Authorization: token,   
            },
        });
        setTimeout(()=>{
            loader.hide();
        },100);
    } catch (error) {
        // console.log(error.response);
        Swal.fire(error.response.data.message);
    }

    getTodoList();
};

// 4.刪除代辦清單
const deleteTodoItem = async (id) => {
    // console.log("刪除鍵",id)
    try {
        await axios.delete(`${api}/todos/${id}`, {
            headers: {
                    Authorization: token,
            },
        });
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
            });
            Toast.fire({
            icon: "success",
            title: "已刪除代辦清單"
        });
    } catch (error) {
        // console.log(error.response);
        Swal.fire(error.response.data.message);
    }

    getTodoList();
};

//5.分類
const  KindTag= ref('all');
//藉由按按鈕使KindTag變更值
const setKindTag = (tag) => {
    KindTag.value = tag;
}
//依按按鈕得到的值進行篩選
const filteredTodoList = computed(() => {
        if (KindTag.value === 'unfinished') {
            return todoList.value.filter((todo) => todo.status === false);
        } else if (KindTag.value === 'done') {
            return todoList.value.filter((todo) => todo.status === true);
        } else {
            return todoList.value;
        }
});
//6.計算unfinished代辦事項有幾個
const countUnfinishedTodo = computed(() => {
        return filteredTodoList.value.filter((todo) => todo.status === false).length;
    });

//7.登出
const signOut = async () => {
    const loader = $loading.show({   
        // Optional parameters
        // container: fullPage.value ? null : formContainer.value,
        canCancel: true,
        // onCancel: onCancel.value
    })
    try {
        const res = await axios.post(
        `${api}/users/sign_out`,
            {},
            {
                headers: {
                    Authorization: token
                }
            }
        )
        loader.hide();
        // console.log(res);
        Swal.fire(res.data.message);

    } catch (error) {
        Swal.fire("登出失敗",`${error}`);
    }

    document.cookie = 'customTodoToken=';
    user.value = '';
    setTimeout(()=>{
            router.push("/login");
    },1500);

}

</script>

<template>
<div id="todoListPage" class="bg-half">
    <nav>
        <h1><a href="#">ONLINE TODO LIST</a></h1>
        <ul>
        <li class="todo_sm"><a href="#"><span>{{user.nickname}}的代辦</span></a></li>
        <li><a href="#" @click.prevent="signOut">登出</a></li>
        </ul>
    </nav>
    <div class="container todoListPage vhContainer">
        <div class="todoList_Content">
            <div class="inputBox">
                <input type="text" placeholder="請輸入待辦事項" v-model="newTodoItem" >
                <button href="#" @click="addTodoItem">
                <i class="fa fa-plus"></i>
                </button>
            </div>
            <div v-if="todoList.length===0" class="blank_content">
                <h2>目前尚無待辦事項</h2>
                <img src="https://s3-alpha-sig.figma.com/img/7465/9ab1/8911ab6dcbda98df56e26aa23c6643ac?Expires=1725840000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BmQcA76gk9l2y3s7vsRdmBkTjO8lYemchgz2fvvQqd6vEzKKoIKpTWxR5Iz6gkNQvICzQzSjfpXqRAiCmhCNaAQ6Nh7~7r0wEuxTCVOUzW8CGb7FlmUhs6GheqqJYxcxGV-lXtINwxY64LwHtFEXuKVwtdn2SiYuHNupWiTlTN77sAjR8vDZyjkSsuq4CXGVik3UGeHkJnsNAa-6eQ~QB-7HcW4F914N17QBifY47i8f~-AxsoBQ4OAmEM7uO-Jv1g1Wu7FEvy8-otCk79O2XZv6BpUsFTUyvDTR113J0ksi79QkwpeD8I6W4wZ1NxKwmvrxER6-COl7hStdVP1-QQ__" alt="">
            </div>            
            <div class="todoList_list" v-else >
                <ul class="todoList_tab">
                    <li>
                        <a href="#" :class="{ active: KindTag === 'all' }"  @click.prevent="setKindTag('all')">全部</a>
                    </li> 
                    <li>
                        <a href="#" :class="{ active: KindTag === 'unfinished' }" @click.prevent="setKindTag('unfinished')">待完成</a>
                    </li>
                    <li>
                        <a href="#" :class="{ active: KindTag === 'done' }" @click.prevent="setKindTag('done')">已完成</a>
                    </li>
                </ul>
                <div class="todoList_items">
                    <ul class="todoList_item">
                        <li  v-for="(todo, index) in filteredTodoList" :key="todo.id">
                            <label class="todoList_label">
                            <input class="todoList_input" type="checkbox" value="true" @click="toggleTodoItem(todo.id)" :checked="todo.status" >
                                <span>{{todo.content}}</span>
                            </label>
                            <button @click="deleteTodoItem(todo.id)">
                                <i class="fa fa-times"></i>
                            </button>
                        </li>
                    </ul>
                    <div class="todoList_statistics" v-if="KindTag === 'unfinished'">
                        <p> 總共有{{countUnfinishedTodo}} 個未完成項目</p>
                    </div>
                    <div class="todoList_statistics" v-else-if="KindTag === 'done'">
                        <p> 總共有{{filteredTodoList.length-countUnfinishedTodo}} 個已完成項目</p>
                    </div>
                    <div class="todoList_statistics" v-else>
                        <p> 總共有{{countUnfinishedTodo}} 個未完成項目</p>
                        <p> 總共有{{filteredTodoList.length-countUnfinishedTodo}} 個已完成項目</p>
                    </div>
                </div>                 
            </div>

        </div>
    </div>
</div>

</template>
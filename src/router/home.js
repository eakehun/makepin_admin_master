import Home from '@/views/Home'
import store from "../store"

const onlyAuthUser = (to, from, next) => {
    store.dispatch('mutationsCheckSession').then(function(userSta) {
        if(userSta.status != 200){
            alert('로그인이 필요한 페이지 입니다.')
            next('/logIn')
        } else {
            next()
        }
    });
}

export default [
    {
        path: '/',
        beforeEnter: onlyAuthUser,   
        name: 'Home',
        component: Home,
    },
]
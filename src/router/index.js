import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import memberFrom from './memberFrom'
import dealFrom from './dealFrom'
import siteFrom from './siteFrom'
import logInFrom from './logInFrom'
import searchFrom from './searchFrom'
import home from './home'
import store from "../store"

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(() => {
    	if(location.name != "logInFrom"){
    		return window.location.reload()
    	}
    })
};

const routes = [
    ...home,
    ...memberFrom,
    ...dealFrom,
    ...siteFrom,
    ...logInFrom,
    ...searchFrom
]
const router = new VueRouter({
    mode: 'history',
    routes
})
export default router
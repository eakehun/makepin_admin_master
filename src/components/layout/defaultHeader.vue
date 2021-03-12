<template>
    <div>
        <div class="defaultHeader" :class='{ hidden_cont: not_header }'>
            <div class="eh_nav"><router-link to="/" class="logo"><img alt="Vue logo" :src="logoImg"></router-link></div>
            <div class="eh_service_name">판매 Service Admin</div>
            <div id="tooltip-target-1" class="eh_userf ck_btn">
                <span>관리자 님</span>
                <b-avatar></b-avatar>
            </div>
            <b-tooltip target="tooltip-target-1" triggers="hover" class="tooltip_ck">
                <div class="logout_btn" @click="logOut">로그아웃</div>
            </b-tooltip>
        </div>
        <div class="defaultHeader" v-if="not_header == true">
            <span class="float-right">판매 Service Admin</span>
        </div>
    </div>
    
</template>

<script>
    import { mapActions } from "vuex"
    export default {
        name: 'defaultHeader',
        data() {
            return{
                logoImg: require('@/assets/images/make_pin_logo.png'),
                not_header: false,
            }
        },
        created() {
            this.diveceHiddenChecked();
        },
        methods: {
            ...mapActions(["logOut"]),

            diveceHiddenChecked(){
                if(this.$route.name == 'logInFrom'){
                    this.not_header = true;
                } else {
                    this.not_header = false;
                }
            }
        },
        watch: {
            not_header(params){
                this.diveceHiddenChecked();
            },

            $route (data){
                this.diveceHiddenChecked();
            }
        }
    }
</script>

<style>
.defaultHeader{position:fixed;top:0;left:0;width:100%;margin-left:0;border-bottom:solid 1px #eee;padding:20px;background-color: #fff;z-index:calc(1030 + 6);color:#444;}
.mobile .signup_logo{margin:100px 0 50px 0;}
.mobile .signup_logo img{width:50%}
.defaultHeader > div{line-height:40px;}
.eh_nav{float:left;width:320px;min-height:40px;}
.eh_nav img{width:160px;}
.eh_service_name{float:left;min-height:40px;}
.eh_userf{float:right;}
.eh_userf span{display:inline-block;line-height:40px;margin-right:10px;}
.eh_userf.ck_btn{background-color:#fff;color:#444;border:none;padding:0;}
.hidden_cont{display:none;}
.logout_btn{padding:.2rem 1rem;cursor:pointer;}

</style>

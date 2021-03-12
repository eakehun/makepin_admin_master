<template>
    <div id="sidebar_kim" no-header visible v-if="notSidemenu">
        <div class="sidebar_body">
            <div :class=" isActive == 1 ? 'active' : ''">
                <router-link to="/">대쉬보드</router-link>
            </div>

            <div :class=" isActive == 2 ? 'active' : ''">
                <router-link to="/member">회원관리</router-link>
            </div>
            <div :class=" isActive == 3 ? 'active' : ''">
                <router-link to="/deal/">판매거래</router-link>
                <div>
                    <router-link :class=" isSubActive == 1 ? 'active' : ''" to="/deal">거래내역</router-link>
                    <router-link :class=" isSubActive == 2 ? 'active' : ''" to="/deal/feeManagement">수수료관리</router-link>
                </div>
            </div>
            <div :class=" isActive == 4 ? 'active' : ''">
                <router-link to="/site">사이트관리</router-link>
                <div>
                    <router-link :class=" isSubActive == 3 ? 'active' : ''" to="/site">1:1 문의관리</router-link>
                    <router-link :class=" isSubActive == 4 ? 'active' : ''" to="/site/noticeBoard">공지사항 관리</router-link>
                    <router-link :class=" isSubActive == 5 ? 'active' : ''" to="/site/frequentlyAskedQuestions">FAQ 관리</router-link>
                    <router-link :class=" isSubActive == 6 ? 'active' : ''" to="/site/serviceHistory">서비스내역</router-link>
                </div>
            </div>
            <div :class=" isActive == 5 ? 'active' : ''">
                <router-link to="/search">조회하기</router-link>
            </div>
        </div>
    </div>
    
</template>

<script>

    export default {
        name: 'defaultHeader',
        data() {
            return{
                logoImg: require('@/assets/images/make_pin_logo.png'),
                not_header: false,
                isActive: 1,
                isSubActive: 0,
                notSidemenu: true
            }
        },
        created() {
            this.diveceHiddenChecked();
            this.checkedMenu(this.$route)
        },
        methods: {
            diveceHiddenChecked(){
                if(this.$route.name == 'logInFrom'){
                    this.not_header = true;
                } else {
                    this.not_header = false;
                }
            },

            checkedMenu(data){
                if(data.name == 'logInFrom'){
                    this.notSidemenu = false
                } else {
                    this.notSidemenu = true
                }
                
                switch (data.name){
                    case 'Home' :
                        this.isActive = 1
                        break;
                    case 'memberManagementList' :
                        this.isActive = 2
                        break;
                    case 'transactionHistoryList' :
                        this.isActive = 3
                        this.isSubActive = 1
                        break;
                    case 'feeManagement' :
                        this.isActive = 3
                        this.isSubActive = 2
                        break;
                    case 'userInquiry' :
                        this.isActive = 4
                        this.isSubActive = 3
                        break;
                    case 'noticeBoard' :
                        this.isActive = 4
                        this.isSubActive = 4
                        break;
                    case 'noticeBoardWriting' :
                        this.isActive = 4
                        this.isSubActive = 4
                        break;
                    case 'noticeBoardModify' :
                        this.isActive = 4
                        this.isSubActive = 4
                        break;        
                    case 'frequentlyAskedQuestions' :
                        this.isActive = 4
                        this.isSubActive = 5
                        break;
                    case 'frequentlyAskedQuestionsModify' :
                        this.isActive = 4
                        this.isSubActive = 5
                        break;
                    case 'frequentlyAskedQuestionsWriting' :
                        this.isActive = 4
                        this.isSubActive = 5
                        break;
                    case 'serviceHistory' :
                        this.isActive = 4
                        this.isSubActive = 6
                        break;
                    case 'searchList' :
                        this.isActive = 5
                        break      
                    default :
                        this.isActive = 0
                    // console.log(data.name, this.isActive )
                }
            }
        },
        watch: {
            not_header(params){
                this.diveceHiddenChecked();
            },

            $route (data){
                // console.log(data.name)
                this.checkedMenu(data)
                this.diveceHiddenChecked();
            }
        }
    }
</script>

<style scoped="">
.side_menu_head{height:65px;}
#sidebar_kim{display:flex;flex-direction:column;position:fixed!important;top:0;height:100vh;width:320px;max-width:100%!important;margin:0!important;outline:0;transform:translateX(0);background-color:#f7f7f7;}
.sidebar_body{padding:6rem 0 0 0;box-sizing: border-box;}
.sidebar_body > div{}
.sidebar_body > div:after{content:'';display:block;clear:both;}
.sidebar_body > div > a{float:left;width:100%;color:#444;padding:.7rem 1rem;position:relative;}
.sidebar_body > div.active{position:relative;}
.sidebar_body > div.active > a:after{content:'';display:block;width:5px;height:100%;position:absolute;top:0;left:0;background-color:#333;}
.sidebar_body > div.active > a{font-weight:700;background-color:#ededed;}
.sidebar_body > div > div{float:left;width:100%;}
.sidebar_body > div.active > div{display:block;}
.sidebar_body > div > div > a{display: block;color:#444;padding:.5rem 2rem;font-size:.8rem;}
.sidebar_body > div.active > div > a.active{text-decoration: underline;}

</style>

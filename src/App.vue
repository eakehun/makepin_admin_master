<template>
    <div id="app" :class="$mq" >
        <sideMenu />
        <defaultHeader />
        <div class="admin_container" :class="pageName == 'logInFrom' ? 'logIn_from' : ''">
            <router-view />
        </div>

        <defaultFooter />
    </div>
</template>
<script>
    import sideMenu from '@/components/layout/sideMenu.vue'
    import defaultHeader from '@/components/layout/defaultHeader.vue'
    import defaultFooter from '@/components/layout/defaultFooter.vue'

    export default {
        name: 'app',
        data() {
            return {
                fields: ['은행', '업무시간', '정기점검시간'],
                items: [
                { 은행: '산업은행', 업무시간: '00:30 ~ 23:30', 정기점검시간: '매주 일요일 00:00 ~ 04:00' },
                { 은행: '기업은행', 업무시간: '00:30 ~ 24:00', 정기점검시간: '없음' },
                { 은행: '국민은행', 업무시간: '00:30 ~ 24:00', 정기점검시간: '3주차 일요일 00:00 ~ 00:30, 05:00 ~ 05:30' },
                { 은행: '수협', 업무시간: '없음', 정기점검시간: '없음' },
                { 은행: '농협', 업무시간: '없음', 정기점검시간: '없음' },
                { 은행: '우리은행', 업무시간: '00:30 ~ 23:50', 정기점검시간: '매주 금요일 00:00~00:40, 2주차 일요일 00:00 ~ 06:00' },
                { 은행: '제일은행', 업무시간: '00:30 ~ 23:30', 정기점검시간: '없음' },
                { 은행: '시티은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '공휴일 다음 00:00 ~ 02:00, 매일 00:00 ~ 04:30' },
                { 은행: '대구은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '분기말에 한번 일요일 00:00 ~ 06:00' },
                { 은행: '부산은행', 업무시간: '00:30 ~ 23:30', 정기점검시간: '월요일 00:00 ~ 04:00' },
                { 은행: '광주은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '2주차 일요일 00:00 ~ 06:00' },
                { 은행: '제주은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '월, 수 04:30 ~ 05:00' },
                { 은행: '전북은행', 업무시간: '00:30 ~ 24:00', 정기점검시간: '2주차 토요일 00:00 ~ 04:00' },
                { 은행: '경남은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '2주차 일요일 02:00 ~ 06:00' },
                { 은행: '새마을금고', 업무시간: '00:30 ~ 23:50', 정기점검시간: '없음' },
                { 은행: '신협', 업무시간: '00:30 ~ 23:40', 정기점검시간: '없음' },
                { 은행: '우체국', 업무시간: '00:30 ~ 23:40', 정기점검시간: '매일 04:00 ~ 05:00' },
                { 은행: '하나은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '없음' },
                { 은행: '신한은행', 업무시간: '00:30 ~ 23:40', 정기점검시간: '00:00 ~ 01:00' },
                ],
                pageName: this.$route.name,
            }
        },
        components: {
            sideMenu,
            defaultHeader,
            defaultFooter,
        },
        mounted() {
        },
        computed: {
            doubleCounter() {
                return this.$store.getters.doubleCounter;
            },
        },
        watch: {
            $mq (val){
                //this.$store.dispatch('checkDevice', val)
            },
            $route (data){
                this.pageName = data.name
            }
        }
    }
</script>
<style>
#app{}
*:focus,
button:focus {outline:0;outline: none;}
input::placeholder{font-size:.87rem;color:#999;}
ul, li{list-style:none;}
.textC{text-align:center;}
.admin_container{float:left;width:calc(100% - 320px);margin-left:320px;margin-top:85px;padding:20px;}
.admin_container.logIn_from{width:100%;margin-left:0;}
.table td, .table th{vertical-align: middle;}
</style>
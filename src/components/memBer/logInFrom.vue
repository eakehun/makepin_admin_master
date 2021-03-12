<template>
	<div>
		<div class="from_box">
			<input
			id="input-id"
			v-model="id"
			type="email"
			class=""
			required
			placeholder="아이디(이메일)을 입력해주세요."
			>
			​
			<input
			id="input-password"
			v-model="pwd"
			type="password"
			required
			placeholder="비밀번호를 입력해주세요."
			>
			​
			<b-button variant="primary" class="login_btn" @click="login({id, pwd})" >로그인</b-button>
		</div>
	</div>
</template>
<script>
	import { mapState, mapActions } from "vuex"
	export default{
		name: 'logInFrom',
		data() {
			return {
				id: '',
				pwd: '',
				checked: false,
				idPass: false,
				pwdPass: false,
				pw_passed: true,
				logoImg: require('@/assets/images/make_pin_logo.png'),
			}
		},
		computed: {
			...mapState(["isLogin", "isLoginError"])
		},
		methods: {
			...mapActions(["login", "logOut"]),

			showMsgBoxOne() {
				this.boxTwo = ''
				this.$bvModal.msgBoxConfirm('변경하시겠습니까?', {
					okTitle: '확인',
					okVariant: 'outline-dark',
					footerClass: 'p-2 border-top-0',
					hideHeaderClose: false,
					centered: true
				})
				.then(value => {
					this.boxTwo = value
				})
				.catch(err => {

				})
			},
		},
	}
</script>
​
<style scoped="">
.from_box{border-bottom:solid 1px #ddd;margin-bottom:10px;}
.from_box input{width:100%;border:solid 1px #ddd;border-radius:5px;margin:10px 0;padding:6px 10px;}
.btn.login_btn{width:100%;border-radius:0;}
.user_infor{text-align:center;}
.user_infor:after{content:'';display:block;clear:both;}
.user_infor a{color:#444;font-size:.75em;}
.user_infor a:first-child:before{display:none;}
.user_infor a:first-child + a:before{content:'/';display:inline-block;clear:both;padding:0 5px;}
.sign_up_btn{float:left;width:100%;background-color:#fff;height:40px;line-height:40px;text-align:center;color:#444;margin-top:10px;border:solid 1px #ccc;}
</style>
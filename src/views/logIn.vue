<template>
	<div class="login_container col-md-5">
		<b-container class="mt-md-5 mt-4 mb-md-5 mb-4">
			<router-link to="/" class="signup_logo"><img alt="Vue logo" :src="logoImg"></router-link>
			<div class="signFromCont">
				<router-view></router-view>
			</div>
			
		</b-container>
	</div>
</template>

<script>
	export default {
		name: 'logIn',
		data(){
			return {
				logoImg: require('@/assets/images/make_pin_logo.png'),
			}
		},
	}
</script>

<style scoped="">
.login_container.col-md-5{max-width:550px;margin:0 auto;padding:100px 0;}
.signFromCont {
    border: 1px solid #ededed;
    border-radius: 20px;
    padding: 50px;
    display: block;
}
.signup_logo{display:block;text-align:center;margin-bottom:100px}
.signup_logo img{width:280px}
</style>
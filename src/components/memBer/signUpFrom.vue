<template>
	<div>
		<slot name="header"></slot>

		<div class="checksWrap_type1" id="fregister_chkall">
			<div class="checks">
				<input type="checkbox" @change="toggleAll" v-model="selected" name="chk_all" value="1" id="chk_all">
				<label for="chk_all" :style="'background-image:url('+backgroundImage+')'">모두 동의합니다.</label>
			</div>
		</div>

		<div class="mb_section_box">
			<section class="mb_section" id="fregister_term" v-for="(item, index) in flavours" v-bind:key="item">
				<fieldset class="fregister_agree">
					<div class="checksWrap_type1">
						<div class="checks">
							<input type="checkbox" @click="inputClick" v-model="selected" name="agree" :id="'chk_'+index" :value="item">
							<label :for="'chk_'+index" :style="'background-image:url('+backgroundImage+')'"></label>
							<span @click="modalId(index)">{{item}}</span>
						</div>
					</div>
				</fieldset>
			</section>
		</div>
		<b-modal id="modal-1" title="BootstrapVue">
			<p class="my-4">{{}}</p>
		</b-modal>
		<button id="nextDeptnBtn" class="btnn bTcont" @click="nextPageBtn">다음</button>
	</div>
</template>
<script>
	export default{
		name: 'signUpFrom',
		data() {
			return {
				show: true,
				flavours: ['만 14세 이상입니다. (필수)', '이용약관 동의 (필수)', '개인정보처리방침 (필수)', '개인정보 제3자 제공 동의 (필수)', '마케팅정보 수신 동의 (필수)'],
				selected: [],
				allSelected: false,
				indeterminate: false,
				informationData:'',
				backgroundImage: require('@/assets/ico_chk.png'),
				boxOne: '',
				agreements: []
			}
		},
		methods: {
			inputClick(checked) {
				if(checked.target.checked == true){
					checked.target.nextElementSibling.style.backgroundPosition = '0 -20px'
				} else {
					checked.target.nextElementSibling.style.backgroundPosition = '0 0'
				}
			},

			toggleAll(checked) {
				var allInpout = document.querySelectorAll('.mb_section_box input');
				if(this.flavours.length != this.selected.length){
					this.selected = this.flavours
					for(var i=0;this.flavours.length > i;i++){
						allInpout[i].checked = true;
						allInpout[i].nextElementSibling.style.backgroundPosition = '0 -20px'
					}
				} else {
					this.selected = []
					for(var i=0;this.flavours.length > i;i++){
						allInpout[i].checked = false;
						allInpout[i].nextElementSibling.style.backgroundPosition = '0 0'
					}
				}
			},

			modalId(i) {
				this.boxTwo = ''
				this.$bvModal.msgBoxOk(this.alertText(i), {
					okTitle: '확인',
					cancelTitle: '취소',
					okVariant: 'outline-dark',
					cancelVariant: 'outline-dark',
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

			alertText(target){
				switch (target){
					case 0 :
						return '만 14세 이상입니다.'
						break;
					case 1 :
						return '이용약관 동의'
						break;
					case 2 :
						return '개인정보처리방침'
						break;
					case 3 :
						return '개인정보 제3자 제공 동의'
						break;
					case 4 :
						return '마케팅정보 수신 동의'
						break;
					case 99 :
						return '모든 항목은 필수사항입니다.'
						break;	
					default :
						// console.log('이외 데이터')
				}
			},

			nextPageBtn(){
				if(this.allSelected){
					this.$router.push({name: 'signUpUserFrom', path: 'signUpUserFrom', query: {idx: this.agreements}}, function() {
						// console.log("signUpUserFrom 호출 완료");
					})
				} else if(this.selected.length == 4 && this.selected.indexOf('마케팅정보 수신 동의 (필수)') == -1){
					this.$router.push({name: 'signUpUserFrom', path: 'signUpUserFrom', query: {idx: this.agreements}}, function() {
						// console.log("signUpUserFrom 호출 완료");
					})
				} else {
					this.modalId(99)
					console.log("모든 항목은 필수사항입니다.");
				}
			}
		},
		watch: {
			selected(newVal) {
				var selectAll = document.getElementById('chk_all');
				document.getElementById('nextDeptnBtn').classList.remove('grd');

				if (newVal.length === 0) {//체크가 0일때
					this.indeterminate = false;
					this.allSelected = false;
					selectAll.checked = false;
					selectAll.nextElementSibling.style.backgroundPosition = '0 0'
				} else if (newVal.length === this.flavours.length) {//전체 체크 됬을때
					this.indeterminate = false;
					this.allSelected = true;
					selectAll.checked = true;
					this.agreements = ['idx1', 'idx2', 'idx3', 'idx4']
					selectAll.nextElementSibling.style.backgroundPosition = '0 -20px'
					document.getElementById('nextDeptnBtn').classList.add('grd')
				} else if(newVal.length == 4 && newVal.indexOf('마케팅정보 수신 동의 (필수)') == -1) {//필수사항만 체크되었을 경우
					this.indeterminate = false;
					this.allSelected = false;
					selectAll.checked = false;
					selectAll.nextElementSibling.style.backgroundPosition = '0 -20px'
					this.agreements = ['idx1', 'idx2', 'idx3', 'idx4', 'idx5']
					document.getElementById('nextDeptnBtn').classList.add('grd')
				} else {//한개 이상 체크되 었을때
					this.indeterminate = true;
					this.allSelected = false;
				}
			}
		}
	}
</script>

<style scoped="">
.mb_cont_tit{padding-bottom:10px;margin-bottom:20px;border-bottom:2px solid #222}
.mb_cont_tit p{padding:0;margin:0;color:#666;}
#fregister_chkall{border-bottom:1px solid #e4e4e4;padding-bottom:16px;margin-bottom:20px;}
#fregister_chkall label{font-size:18px}
.checksWrap_type1{position:relative;text-align:left}
.checksWrap_type1 .checks{position:relative;line-height:20px;display:inline-block;overflow:hidden;margin:5px 0}
.checksWrap_type1 input[type=checkbox]{position:absolute;top:0;left:0;margin:0;padding:0;z-index:-1;width:12px;height:12px;-webkit-appearance:none;opacity:0;-moz-opacity:0}
.checksWrap_type1 label{float:left;position:relative;top:0;left:0;height:20px;line-height:20px;font-size:16px;color:#222;background:#fff;padding:0 0 0 28px;background-repeat:no-repeat;background-size:20px;margin:0;z-index:10}
.checksWrap_type1 .checks.on label{background-position:0 -20px}
.checksWrap_type1 .checks label.on{background-position:0 -20px}
.checksWrap_type1 label:before{content:'';display:inline-block;width:20px;height:20px;border-radius:50%;-webkit-background-size:20px 40px;background-size:20px 40px;position:absolute;left:0;top:0}
.checksWrap_type1 a{display:inline-block;font-size:13px;line-height:24px;padding:0 12px;background:#fff;border:1px solid #eaeaea;color:#999;border-radius:2px;position:absolute;right:0;top:0}
.checksWrap_type1 a:hover{background:#f9f9f9}
.mb_section{margin-top:10px;padding-left:20px;}
.mb_section:first-child{margin-top:25px}
fieldset{border:0}


</style>
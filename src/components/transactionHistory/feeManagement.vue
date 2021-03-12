<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>판매거래</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>수수료관리</div>
		</div>

		<table class="table table-no-more">
			<tbody>
				<tr>
					<th>브랜드 선택</th>
					<td>
						<b-form-group v-slot="{ ariaDescribedby }" class="sta_radio_box">
							<b-form-radio v-model="selectCompany" :aria-describedby="ariaDescribedby" name="some-radios" value="컬처랜드">컬처랜드</b-form-radio>
							<b-form-radio v-model="selectCompany" :aria-describedby="ariaDescribedby" name="some-radios" value="해피머니">해피머니</b-form-radio>
						</b-form-group>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-if="selectCompany == '컬처랜드'">
			<h5>컬처랜드</h5>
			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>매입 수수료</th>
						<td>
							<div class="fee_list input">
								<b-form-input placeholder="" v-model="cultureLoadData.purchaseFeePercents" @blur="inputBlur"></b-form-input>
							</div>
							<span>%</span>
						</td>
					</tr>
					<tr>
						<th>이체 수수료</th>
						<td>
							<div class="fee_list input">
								<b-form-input placeholder="" v-model="cultureLoadData.transperFees" @blur="inputBlur"></b-form-input>
							</div>
							<span>원</span>
						</td>
					</tr>
					<tr>
						<th>이체 수수료 면제 금액</th>
						<td>
							<div class="fee_list input">
								<b-form-input placeholder="" v-model="cultureLoadData.waiverAmount" @blur="inputBlur"></b-form-input>
							</div>
							<span>원</span>
						</td>
					</tr>
					<tr>
						<th>수수료 변경일시</th>
						<td>
							<div>{{cultureLoadData.updateDate}}</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-else>
			<h5>해피머니</h5>
			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>매입 수수료</th>
						<td>
							<div class="fee_list input">
								<b-form-input placeholder="" v-model="happyLoadData.purchaseFeePercents" @blur="inputBlur"></b-form-input>
							</div>
							<span>%</span>
						</td>
					</tr>
					<tr>
						<th>이체 수수료</th>
						<td>
							<div class="fee_list input">
								<b-form-input placeholder="" v-model="happyLoadData.transperFees" @blur="inputBlur"></b-form-input>
							</div>
							<span>원</span>
						</td>
					</tr>
					<tr>
						<th>이체 수수료 면제 금액</th>
						<td>
							<div class="fee_list input">
								<b-form-input placeholder="" v-model="happyLoadData.waiverAmount" @blur="inputBlur"></b-form-input>
							</div>
							<span>원</span>
						</td>
					</tr>
					<tr>
						<th>수수료 변경일시</th>
						<td>
							<div>{{happyLoadData.updateDate}}</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="btn_wrap1">
			<b-button variant="primary" @click="showMsgBoxTwo">수정하기</b-button>
		</div>
	</div>
</template>
<script>
	import axios from "axios"
	export default {
		name: 'feeManagement',
		data() {
			return {
				selectCompany: '컬처랜드',
				searchSelectedData:'',
				from: {
					idx: '',
					company: '',
					transperFees:'',
					purchaseFeePercents: '',
					waiverAmount: '',
				},
				cultureLoadData: {},
				happyLoadData: {},
			}
		},
		mounted(){
			this.feesLoadData()
		},
		methods: {
			inputBlur(){

			},

			showMsgBoxOne() {
				this.boxTwo = ''
				this.$bvModal.msgBoxOk('변경되었습니다', {
					okTitle: '확인',
					okVariant: 'outline-dark',
					footerClass: 'p-2 border-top-0',
					hideHeaderClose: false,
					centered: true
				})
				.then(value => {
					
				})
				.catch(err => {

				})
			},

			showMsgBoxTwo() {
				this.boxTwo = ''
				this.$bvModal.msgBoxConfirm('수수료를 변경하시겠습니까?', {
					okTitle: '확인',
					cancelTitle: '취소',
					okVariant: 'outline-dark',
					cancelVariant: 'outline-dark',
					footerClass: 'p-2 border-top-0',
					hideHeaderClose: false,
					centered: true
				})
				.then(value => {
					if(value){
						this.checkedFees()
					}
				})
				.catch(err => {

				})
			},

			feesLoadData(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/fee/', { withCredentials: true })
				.then( res => {
					if(res.data.content[0].company == '해피머니'){
						this.happyLoadData = res.data.content[0]
					}
					if(res.data.content[1].company == '컬처랜드'){
						this.cultureLoadData = res.data.content[1]
					}
				})
				.catch( err => {
					console.log(err)
				});
			},

			numberWithCommas(data) {
				return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			},

			checkedFees(){
				if(this.selectCompany == '컬처랜드'){
					this.from.idx = this.cultureLoadData.idx
					this.from.company = this.cultureLoadData.company
					this.from.transperFees = this.cultureLoadData.transperFees
					this.from.purchaseFeePercents = this.cultureLoadData.purchaseFeePercents
					this.from.waiverAmount = this.cultureLoadData.waiverAmount
				} else {
					this.from.idx = this.happyLoadData.idx
					this.from.company = this.happyLoadData.company
					this.from.transperFees = this.happyLoadData.transperFees
					this.from.purchaseFeePercents = this.happyLoadData.purchaseFeePercents
					this.from.waiverAmount = this.happyLoadData.waiverAmount
				}
				this.changeFees()
			},

			changeFees(){
    			axios
				.put(process.env.VUE_APP_BASE_URL + '/admin/fee/', this.from ,{ withCredentials: true })
				.then( res => {
					this.showMsgBoxOne()
				})
				.catch( err => {
					console.log(err)
				});
			}
			
		}
	}
</script>

<style scoped="">
.table>tbody>tr>th{width:200px;background-color:#ededed;}
.fee_list.input{float:left;width:200px;}
.fee_list.input + span{float:left;line-height:38px;margin-left:10px;}
.table>tbody>tr>td{text-align:left;}
.btn_wrap1{text-align:center;}
.form-group.sta_radio_box{margin:0;}
	.form-group.sta_radio_box .btn{float:left;margin-left:20px;}
	.sta_radio_box .custom-control{float:left;margin-left:10px;margin-top:4px;}
</style>
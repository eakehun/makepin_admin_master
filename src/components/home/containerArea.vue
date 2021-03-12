<template>
	<div>
		<b-modal
		id="accChangeBox"
		ref="modal"
		title="판매서비스 상태 변경 사유입력"
		@show="resetModal"
		@hidden="resetModal"
		@ok="handleOk"
		ok-title="상태변경"
		cancel-title="취소"
		>
			<form ref="form" @submit.stop.prevent="handleSubmit">
				<b-form-group
				:label="'대상 상품권 : '+changeName "
				label-for="name-input"
				invalid-feedback="Name is required"
				:state="nameState"
				>
				<b-form-input
				id="name-input"
				v-model="content"
				:state="nameState"
				required
				></b-form-input>
			</b-form-group>
		</form>
		</b-modal>

		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>Dashboard</div>
		</div>

		<b-card-group deck>
			<b-card header="판매서비스 현황">
				<table class="table b-table table_type2">
					<caption>최근 7일</caption>
					<thead role="rowgroup" class="">
						<tr role="row" class="">
							<th scope="col" class=""><div>상태</div></th>
							<th scope="col" class=""><div>비고</div></th>
						</tr>
					</thead>
					<tbody role="rowgroup">
						<tr role="row" class="">
							<td role="cell" class="">
								<p>
									<div>
										{{tradingStaData[0].brandName}}
										<span class="sta_f">{{tradingStaData[0].used == true ? '' : '(중지)' }}</span>
										<b-button variant="outline-primary" class="float-right" size="sm" @click="showMsgBoxTwo(tradingStaData[0])">상태변경</b-button>
									</div>
								</p>
								<p>
									<div>
										{{tradingStaData[1].brandName}}
										<span class="sta_f">{{tradingStaData[1].used == true ? '' : '(중지)' }}</span>
										<b-button variant="outline-primary" class="float-right" size="sm" @click="showMsgBoxTwo(tradingStaData[1])">상태변경</b-button>
									</div>
								</p>
							</td>
							<td role="cell" class="">
								<span v-if="tradingStaData[0].used != true">{{tradingStaData[0].used == true ? '' : tradingStaData[0].createDate }}</span>
								<span v-if="tradingStaData[1].used != true">{{tradingStaData[1].used == true ? '' : tradingStaData[1].createDate }}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</b-card>

			<b-card no-body header="1:1 문의 현황">
				<b-card-body>
					<div class="tbl_text">
						<div class="tbl_text_td">
							<div class="tbl_text_name">미답변 : </div>
							<div class="tbl_text_val"> {{userInquiryTotalData}} 건</div>
						</div>
					</div>
				</b-card-body>
			</b-card>
		</b-card-group>

		<b-card-group deck class="mt-4">
			<b-card header="당월 누적">
				<b-card-group deck>
					<b-card no-header>
						<b-card-text>
							<h4>{{monthTotal.trading}}</h4>
							<b-icon-caret-up-fill></b-icon-caret-up-fill>
							<span class="ml-2">판매요청회원</span>
						</b-card-text>
					</b-card>

					<b-card no-header>
						<b-card-text>
							<h4>{{monthTotal.users}}</h4>
							<b-icon-caret-up-fill></b-icon-caret-up-fill>
							<span class="ml-2">판매요청건수</span>
						</b-card-text>
					</b-card>

					<b-card no-header>
						<b-card-text>
							<h4>{{monthTotal.pincode}}</h4>
							<b-icon-caret-up-fill></b-icon-caret-up-fill>
							<span class="ml-2">판매요청핀코드</span>
						</b-card-text>
					</b-card>

					<b-card no-header>
						<b-card-text>
							<h4>{{monthTotal.request_price == null ? 0 : monthTotal.request_price }}</h4>
							<b-icon-caret-up-fill></b-icon-caret-up-fill>
							<span class="ml-2">판매금액</span>
						</b-card-text>
					</b-card>

					<b-card no-header>
						<b-card-text>
							<h4>{{monthTotal.complete_price == null ? 0 : monthTotal.complete_price }}</h4>
							<b-icon-caret-up-fill></b-icon-caret-up-fill>
							<span class="ml-2">입금금액</span>
						</b-card-text>
					</b-card>
				</b-card-group>
			</b-card>
		</b-card-group>

		<b-card-group deck class="mt-4">
			<b-card header="최근 7일">
				<b-table :items="items2" :fields="fields2">
					<template #table-caption>최근 7일</template>
				</b-table>
			</b-card>
		</b-card-group>

	</div>

</template>

<script>
	import axios from "axios"
	import 'swiper/swiper-bundle.css'
	import { mapState, mapActions } from "vuex"
	export default {
		name: 'containerArea',
		data() {
			return { 
				content: '',
				nameState: null,
				submittedNames: [],
				monthTotal: {
					trading: '',
					users: '',
					pincode: '',
					request_price:'',
					complete_price: '',
				},
				chnageObj: {},
				changeName: '',
				userInquiryTotalData: '',
				tradingStaData: [
					{ idx: 0, brandName: '', used: '', createDate: '' },
					{ idx: 0, brandName: '', used: '', createDate: '' }
				],
				selected: 'cultureland',
				fields1: [
				{ key: 'sta', label: '상태'},
				{ key: 'remark	', label: '비고'},
				],
				items1: [
				{ sta: 40, remark: 'Dickerson',},
				],
				fields2: [
					{ key: 'date', label: '일자' },
					{ key: 'tradingCount', label: '판매요청 건수' },
					{ key: 'pinCodeCount', label: '판매요청 핀코드' },
					{ key: 'request_price', label: '판매금액' },
					{ key: 'complete_price', label: '입금금액' },
				],
				items2: []
			}
		},
		computed: {
			...mapState(["isLogin", "isLoginError"])
		},

		mounted() {
			this.tradingMonthTotal() 
			this.usersMonthTotal() 
			this.pincodeMonthTotal() 
			this.priceMonthTotal()
			this.userInquiryTotal()
			this.tradingMenuData()
			this.tradingRecent()
		},

		methods: {
			...mapActions(["login", "logOut"]),

			showMsgBoxOne(text) {
				this.boxTwo = ''
				this.$bvModal.msgBoxOk(text, {
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

			showMsgBoxTwo(obj) {
				var stext = '';
				var targetData = new Object()
				if(obj.used){
					stext = '중지';
				} else {
					stext = '정상';
				}
				const h = this.$createElement
				const messageVNode = h('div', { class: ['foobar'] }, [
					h('p', { class: ['text-center mt-3'] }, ['판매서비스가 '+ stext +'로 전환됩니다.',]),
					h('p', { class: ['text-center mb-0'] }, ['진행하시겠습니까?',]),
				])

				this.boxTwo = ''
				this.$bvModal.msgBoxConfirm([messageVNode], {
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
						this.changeName = obj.menuName == 'culture' ? '컬처랜드' : '해피머니'
						this.$bvModal.show('accChangeBox')
						this.chnageObj = obj
						// this.tradingChange(obj)
					}
				})
				.catch(err => {

				})
			},

			tradingChange(obj){
				axios
				.put(process.env.VUE_APP_BASE_URL + '/admin/tradingMenu/', {
						"idx": obj.idx,
						"menuName": obj.menuName,
						"used": obj.used,
						"content" : obj.content
				}, { withCredentials: true })
				.then( res => {
					this.tradingMenuData()
				})
				.catch( err => {
					console.log(err)
				});
			},

			tradingRecent(obj){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/recent/', { withCredentials: true })
				.then( res => {
					this.items2 = res.data
				})
				.catch( err => {
					console.log(err)
				});
			},


			todayData(){
				let today = new Date();   
				let year = today.getFullYear();
				let month = today.getMonth() + 1;
				let date = today.getDate();
				let day = today.getDay();
				return year + '-' + month + '-' + date
			},

			tradingMenuData(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/tradingMenu/', { withCredentials: true })
				.then( res => {
					this.tradingStaData[0].idx = res.data[0].idx
					this.tradingStaData[0].brandName = res.data[0].menuName == 'culture' ? '컬처랜드' : ''
					this.tradingStaData[0].used = res.data[0].used
					this.tradingStaData[0].createDate = res.data[0].createDate
					this.tradingStaData[0].menuName = res.data[0].menuName

					this.tradingStaData[1].idx = res.data[1].idx
					this.tradingStaData[1].brandName = res.data[1].menuName == 'happy' ? '해피머니' : ''
					this.tradingStaData[1].used = res.data[1].used
					this.tradingStaData[1].createDate = res.data[1].createDate
					this.tradingStaData[1].menuName = res.data[1].menuName
				})
				.catch( err => {
					console.log(err)
				});
			},

			//향수 변경 가능서 있음
			userInquiryTotal(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/OneToOne/createDate/fromDate/2020-01-30 16:18:00/toDate/'+ this.todayData() +' 23:58:58/status/Ready/?page=0&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
					this.userInquiryTotalData = res.data.totalElements
				})
				.catch( err => {
					console.log(err)
				});
			},

			tradingMonthTotal(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/month/', { withCredentials: true })
				.then( res => {
					this.monthTotal.trading = res.data
				})
				.catch( err => {
					console.log(err)
				});
			},

			usersMonthTotal(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/users/month/', { withCredentials: true })
				.then( res => {
					this.monthTotal.users = res.data
				})
				.catch( err => {
					console.log(err)
				});
			},

			pincodeMonthTotal(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/pincode/month/', { withCredentials: true })
				.then( res => {
					this.monthTotal.pincode = res.data
				})
				.catch( err => {
					console.log(err)
				});
			},

			priceMonthTotal(){
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/price/month/', { withCredentials: true })
				.then( res => {
					this.monthTotal.request_price = res.data.request_price
					this.monthTotal.complete_price = res.data.complete_price
				})
				.catch( err => {
					console.log(err)
				});
			},

			checkFormValidity() {
				const valid = this.$refs.form.checkValidity()
				this.nameState = valid
				return valid
			},
			resetModal() {
				this.content = ''
				this.nameState = null
			},
			handleOk(bvModalEvt) {
				bvModalEvt.preventDefault()
				this.handleSubmit()
			},
			handleSubmit() {
				if (!this.checkFormValidity()) {
					return
				}
				this.submittedNames.push(this.content)
				
				this.$nextTick(() => {
					this.chnageObj.content = this.content
					if(this.chnageObj.used == true){
						this.chnageObj.used = false
					} else {
						this.chnageObj.used = true
					}
					this.tradingChange(this.chnageObj)
					this.$bvModal.hide('accChangeBox')
				})
			},
			addFaqlist: function(obj){
				this.$store.dispatch('faqList', 'dsd').then(function(resolvedData) {
					this.faqData = resolvedData
					return resolvedData
				}.bind(this))
			}
		},
		watch: {

		}
	}
</script>

<style>
caption{display:none;}
.admin_container table th,
.admin_container table td{border-left:solid 1px #eee;border-top:none;border-bottom:solid 1px #dee2e6;text-align:center;vertical-align: middle;}
table th:first-child,
table td:first-child{border-left:none;}
table tr:first-child th,
table tr:first-child td{border-top:solid 1px #dee2e6;vertical-align:middle;}
.card .card-body .card{box-shadow:none}
.item1_tbl th,
.item1_tbl td{width:50%;}
.card{box-shadow: 0 1px 6px 0 rgb(232 232 232);}
.card-header{background-color:#4c7ee1!important;color:#fff;font-size:1rem;font-weight:700;color:#fff}

.container_box{}

.tbl_text{display:table;width:100%;height:100%;}
.tbl_text_td{display:table-cell;vertical-align:middle;text-align:center;}
.tbl_text_name{display:inline-block;font-size:1.4rem;font-weight:700;}
.tbl_text_val{display:inline-block;font-size:1.2rem;color:#f00;text-decoration:underline;padding:0 5px;}

.tbl_type1{float:left;width:100%;}
.tbl_type1 thead{}
.tbl_type1 th{background-color:#ededed;}
.tbl_type1 td{}
.tbl_type1 th,
.tbl_type1 td{padding:10px;}
.admin_nav{margin:1rem 0;}
.admin_nav:after{content:'';display:block;clear:both;}
.admin_nav > div{float:left;}
.admin_nav .b-icon.bi{float:left;height:14px;margin:5px}
.admin_container .table_type2 th,
.admin_container .table_type2 td{width:50%;vertical-align:middle;line-height:31px;}
.admin_container .table_type2 td > span{display:block;}
.sta_f{font-weight:700;color:#f00;}
</style>

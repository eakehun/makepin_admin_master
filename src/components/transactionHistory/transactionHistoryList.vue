<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>판매거래</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>거래내역</div>
			<div v-if="detailSta != false"><b-icon-chevron-right></b-icon-chevron-right></div>
			<div v-if="detailSta != false">상세</div>
		</div>
		<div v-if="detailSta == false">
			<div>
				<table class="table b-table table_typeA">
					<caption>거래일시</caption>
					<tbody role="rowgroup">
						<tr role="row" class="">
							<td role="cell" class="">거래일시</td>
							<td role="cell" class="">
								<div class="datepicker_list choice_search">
									<select name="choice" v-model="choiceSearchSelected">
										<option value="createDate">판매요청일시</option>
										<option value="pinCompleteDate">판매완료일시</option>
										<option value="withdrawCompleteDate">입금완료일시</option>
									</select>
								</div>
								<div class="datepicker_list">
									<b-input-group>
										<b-form-input
										id="example-input"
										v-model="datepickerValue1"
										type="text"
										placeholder="YYYY-MM-DD"
										autocomplete="off"
										></b-form-input>
										<b-input-group-append>
											<b-form-datepicker
											v-model="datepickerValue1"
											button-only
											right
											locale="en-US"
											aria-controls="example-input"
											@context="onContext"
											></b-form-datepicker>
										</b-input-group-append>
									</b-input-group>
								</div>
								<div class="bluet">~</div>
								<div class="datepicker_list">
									<b-input-group>
										<b-form-input
										id="example-input"
										v-model="datepickerValue2"
										type="text"
										placeholder="YYYY-MM-DD"
										autocomplete="off"
										></b-form-input>
										<b-input-group-append>
											<b-form-datepicker
											v-model="datepickerValue2"
											button-only
											right
											locale="en-US"
											aria-controls="example-input"
											@context="onContext"
											></b-form-datepicker>
										</b-input-group-append>
									</b-input-group>
								</div>
								<div class="datepicker_list">
									<select name="choice" v-model="daySelected">
										<option value="null">기간선택</option>
										<option value="yesterday">어제</option>
										<option value="oneWeekAgo">최근한주</option>
										<option value="oneMonthAgo">최근한달</option>
										<option value="thisMonth">이번달</option>
									</select>
								</div>
							</td>
							<td role="cell" class="" rowspan="3">
								<b-button variant="outline-primary" size="sm" @click="userSearchBtn">검색</b-button>
								<b-button variant="outline-dark" size="sm" @click="resetSearchBtn">초기화</b-button>
							</td>
						</tr>
						<tr role="row" class="">
							<td role="cell" class="">거래상태</td>
							<td role="cell" class="">
								<b-form-group v-slot="{ ariaDescribedby }" class="radio_box">
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="전체">전체</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="판매완료">판매완료</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="판매완료(일부)">판매완료(일부)</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="판매불가">판매불가</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="입금오류">입금오류</b-form-radio>
								</b-form-group>
							</td>
						</tr>

						<tr role="row" class="">
							<td role="cell" class="">키워드 검색</td>
							<td role="cell" class="">
								<div class="datepicker_list keyword">
									<select name="choice" v-model="searchSelected">
										<option value="name">거래번호</option>
										<option value="userId">아이디</option>
										<option value="name">이름</option>
										<option value="tel">휴대폰번호</option>
									</select>
								</div>
								<div class="datepicker_list input">
									<b-form-input placeholder="" v-model="searchSelectedData" @blur="inputBlur"></b-form-input>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="of_cneter">
				<div class="f_left">총 <span>{{totalElements}}</span> 건</div>
				<b-button variant="outline-dark" class="f_right" size="sm" @click="excelDownload">엑셀다운로드</b-button>
			</div>

			<div>
				<b-table responsive :items="items" :fields="fields" class="btl_user_data">
					<template #cell(No.)="data">
						{{ data.no }}
					</template>

					<template #cell(idx)="data">
						<!--  @click="detailGo(data.item.idx)" -->
						<div class="detail_go_btn">{{ data.item.idx }}</div>
					</template>

					<template #cell(company)="data">
						{{ data.item.company == 'culture' ? '컬처랜드' : '해피머니'}}
					</template>

					<template #cell(requestPrice)="data">
						{{ numberWithCommas(data.item.requestPrice) }}
					</template>

					<template #cell(comepletePrice)="data">
						{{ numberWithCommas(data.item.comepletePrice) }}
					</template>
					
					<template #cell(fees)="data">
						{{ data.item.fees != null ? numberWithCommas(data.item.fees): '-'}}
					</template>

					<!-- 상태 -->
					<template #cell(status)="data">
						<div class="staStatus fc_red" v-if="data.item.status == '입금오류'" @click="depositAccount(data.item)">{{ data.item.status }}</div>
						<div class="staStatus" v-else @click="depositAccount(data.item)">{{data.item.status}}</div>
					</template>

					<template #cell(pincode.length)="data">
						<div class="pincodeBtn" @click="openModal(data.item.pincode)">{{ data.item.pincode.length }}</div>
					</template>

					<template #cell(device)="data">
						{{ data.item.device == null ? '-' : data.item.device }}
					</template>

					<template #cell(pinCompleteDate)="data">
						{{ data.item.pinCompleteDate == null ? '-' : data.item.pinCompleteDate }}
					</template>

					<template #cell(withdrawCompleteDate)="data">
						{{ data.item.withdrawCompleteDate == null ? '-' : data.item.withdrawCompleteDate }}
					</template>

				</b-table>
			</div>
			<div class="pagination_cont">
				<b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="totalPages" use-router align="center"></b-pagination-nav>
			</div>
		</div>

		<b-modal id="openModal" centered hide-header hide-footer>
			<div class="pincodeModatTbl" v-for="pincodeData in pincodeData">
				<div class="name">핀코드</div>
				<div class="code">{{pincodeData.pinCode}}</div>
			</div>
		</b-modal>

		<!-- <b-modal id="depositError" centered title="계좌이체 정보">
			<div class="pincodeModatTbl">
				<div class="name">은행</div>
				<div class="code">{{userData.accountName}}</div>
				<div class="name">계좌번</div>
				<div class="code">{{userData.accountNum}}</div>
				<div class="name">이체금액</div>
				<div class="code">{{userData.comepletePrice}}</div>
				<div class="name">상태</div>
				<div class="code">{{userData.withdrawStatus}}</div>
			</div>
		</b-modal> -->

		<b-modal
	      id="depositError"
	      centered
	      title="계좌이체 정보"
	    >
	      <b-container fluid>
	        <b-row class="mb-1">
	          <b-col cols="3">은행</b-col>
	          <b-col>{{userData.accountName}}</b-col>
	        </b-row>

	        <b-row class="mb-1">
	          <b-col cols="3">계좌번호</b-col>
	          <b-col>{{userData.accountNum}}</b-col>
	        </b-row>

	        <b-row class="mb-1">
	          <b-col cols="3">이체금액</b-col>
	          <b-col>{{userData.comepletePrice}}</b-col>
	        </b-row>

	        <b-row class="mb-1">
	        	<b-col cols="3">상태</b-col>
	        	<b-col>
	        		<div class="fc_red" v-if="userData.status == '입금오류'">{{ userData.status }}</div>
	        		<div v-else>{{userData.status}}</div>
	        	</b-col>
	        </b-row>
	      </b-container>

	      <template #modal-footer="{ ok, cancel, hide }">
	      	<b-button size="sm" variant="secondary" @click="cancel()">Cancel</b-button>
	      	<b-button size="sm" variant="primary" @click="showMsgBoxTwo" v-if="depositErrorSta == true">계좌이체 재처리</b-button>
	      </template>
	 
	    </b-modal>

	</div>
</template>

<script>
	//status - 입금오류
	//거래 - 어드민 - 송금 (최상위 idx)

	import { mapState, mapActions } from "vuex"
	import axios from "axios"
	export default{
		name: 'transactionHistoryList',
		data() {
			return {
				datepickerValue1: '',
				formatted: '',
				datepickerValue2: '',
				daySelected: null,
				searchSelectedData:'',
				searchSelected: 'name',
				userSelected: '전체',
				searchUrlName1: '',
				searchUrlName2: '',
				userUrlName: '',
				resetBtnSta: false,
				detailSta: false,
				detailData: '',
				staSelect: '',
				pincodeData: '',
				depositErrorSta: false,
				totalElements: 0,
				userData: {
					accountName:'',
					accountNum:'',
					comepletePrice:'',
					status:'',
				},
				choiceSearchSelected: 'createDate',
				options: [
				{ value: null, text: '기간선택' },
				{ value: 'a', text: '오늘' },
				{ value: 'b', text: '어제' },
				{ value: 'C', text: '최근한주' },
				{ value: 'd', text: '최근한달'}
				],
				fields: [
				{ key: 'no', label: 'No.' },
				{ key: 'idx', label: '거래번호' },
				{ key: 'userId', label: '아이디' },
				{ key: 'userName', label: '이름' },
				{ key: 'tel', label: '휴대폰번호' },
				{ key: 'company', label: '구분' },
				{ key: 'message', label: '메세지' },
				{ key: 'pincode.length', label: '매수' },
				{ key: 'requestPrice', label: '판매요청금액' },
				{ key: 'purchaseFeePercents', label: '수수료율' },
				{ key: 'fees', label: '수수료' },
				{ key: 'comepletePrice', label: '입금금액' },
				{ key: 'device', label: '접속기기' },
				{ key: 'status', label: '상태' },
				{ key: 'createDate', label: '판매요청일시' },
				{ key: 'pinCompleteDate', label: '판매완료일시' },
				{ key: 'withdrawCompleteDate', label: '입금완료일시' },
				],
				items: [],
				totalPages: 1,
				currentPage: 1,
			}
		},

		mounted(){
		},

		methods: {
			...mapActions(["logOut"]),

			todayData(){
				let today = new Date();   
				let year = today.getFullYear();
				let month = today.getMonth() + 1;
				let date = today.getDate();
				let day = today.getDay();
				return year + '-' + month + '-' + date
			},

			dayData(obj){
				let day = new Date();   
				if(obj == 'yesterday' || obj == 'oneWeekAgo'){
					var yesterday = day.getDate()
					var num = 0;
					if(obj == 'yesterday'){
						num = 1
					} else if(obj == 'oneWeekAgo') {
						num = 7
					}
					day.setDate(yesterday - num)
				}

				if(obj == 'oneMonthAgo'){
					var monthOfYear = day.getMonth()
					day.setMonth(monthOfYear - 1)
				}

				if(obj == 'thisMonth'){
					var thisMonth = day.getMonth()
					day.setMonth(thisMonth)
					day.setDate(1)
				}

				let year = day.getFullYear();
				let month = day.getMonth() + 1;
				let date = day.getDate();
				return year + '-' + month + '-' + date
			},

			linkGen(pageNum, info) {
				return {
					path: '/deal/',
					query: {
						page: pageNum-1,
						searchText: this.searchSelectedData
					}
				}
			},

			openModal(obj) {
				this.pincodeData = obj
				this.$bvModal.show('openModal')
			},

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

			depositAccount(res) {
				this.depositErrorSta = false
				this.userData.idx = res.idx
				this.userData.accountName = res.accountName
				this.userData.accountNum = res.accountNum
				this.userData.comepletePrice = res.comepletePrice
				this.userData.status = res.status

				if(res.status == '입금오류'){
					this.depositErrorSta = true
				}
				this.$bvModal.show('depositError')
			},

			showMsgBoxTwo(res) {
				this.boxTwo = ''
				this.$bvModal.msgBoxConfirm('계좌이체 재처리를 진행하시겠습니까?', {
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
					if(value == true){
						this.depositErrorAction()
					}
				})
				.catch(err => {

				})
			},

			depositErrorAction(){
				this.$bvModal.hide('depositError')
					this.showMsgBoxOne('계좌이체가 재 요청되었습니다.')
				// axios
				// .put(process.env.VUE_APP_BASE_URL + '/admin/users/idx/'+this.userData.idx+'' ,{ withCredentials: true })
				// .then( res => {
				// 	this.$bvModal.hide('depositError')
				// 	this.showMsgBoxOne('계좌이체가 재 요청되었습니다.')
				// })
				// .catch( err => {
				// 	console.log(err)
				// });
			},

			userSearchBtn(){
				if(this.datepickerValue1 == ''){
					this.datepickerValue1 = '2020-08-30'
					this.datepickerValue2 = this.todayData()
				}

				if(this.datepickerValue2 == ''){
					this.datepickerValue2 = this.todayData()
				}
				
				if(this.searchUrlName1 != '' && this.searchUrlName2 == '' ){
					var text = ''
					if(this.searchUrlName1 == 'name/'){
						text = '이름을 입력해주세요.'
					} else if(this.searchUrlName1 == 'userId/'){
						text = '아이디를 입력해주세요.'
					} else if(this.searchUrlName1 == 'tel/'){
						text = '휴대폰 번호를 입력해주세요.'
					} else if(this.searchUrlName1 == 'idx/'){
						text = '회원번호를 입력해주세요.'
					}
					this.showMsgBoxOne(text)
					return
				}
				this.totalPages = 1
				this.currentPage = 1
				if(this.$router.currentRoute.query.page != undefined) this.$router.push({query: {page: 0,searchText: this.searchSelectedData}});
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/'+this.choiceSearchSelected+'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page=0&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
					this.totalElements = res.data.totalElements
					if(res.data.totalPages == 0){
						this.items = []
						this.totalPages = 1
					} else {
						this.items = res.data.content
						this.totalPages = res.data.totalPages
						if(res.data.totalElements < 10){
							for(var i = 0; res.data.totalElements > i; i++){
								this.items[i].no = i+1
							}
						} else {
							var num = res.data.number+1
							var lastNum = (num-1) * res.data.size + 1
							for(var i = 0; res.data.size > i; i++){
								this.items[i].no = lastNum+i
							}
						}
					}
				})
				.catch( err => {
					console.log(err)
				});
			},

			excelDownload(){
				var url = process.env.VUE_APP_BASE_URL + '/admin/trading/'+this.choiceSearchSelected+'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'download/?page=0&size=10&sort=idx,desc'
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/'+this.choiceSearchSelected+'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'download/?page=0&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
			        const link = document.createElement('a');
			        link.href = url;
			        link.setAttribute('download', '거래내역_'+this.datepickerValue1+'_'+this.datepickerValue2+'.xlsx');
			        document.body.appendChild(link);
			        link.click();
				})
				.catch( err => {
					console.log(err)
				});
			},

			detailGo(idx){
				this.detailSta = true
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/users/idx/'+idx+'', { withCredentials: true })
				.then( res => {
					this.detailData = res.data
				})
				.catch( err => {
					console.log(err)
				});
			},

			detailClose(){
				this.detailSta = false
			},

			resetSearchBtn(){
				this.resetBtnSta = true
				this.datepickerValue1 = ''
				this.datepickerValue2 = ''
				this.userSelected = '전체'
				this.daySelected = null
				this.searchSelected = 'name'
				this.userUrlName = ''
				this.searchUrlName1 = ''
				this.searchUrlName2 = ''
				this.searchSelectedData = ''
				this.items = []
				this.totalPages = 1
				this.currentPage = 1
				this.choiceSearchSelected = 'createDate'
				this.$router.push({name: 'transactionHistoryList', path: '/deal'}, function() {
					// console.log("memberManagementList 호출 완료");
				});
			},

			onContext(ctx) {
				this.formatted = ctx.selectedFormatted
			},

			inputBlur(){
				if(this.searchSelected == 'name'){
					if(this.resetBtnSta == true){
						this.searchUrlName1 = ''
						this.resetBtnSta = false
					} else {
						this.searchUrlName1 = ''+this.searchSelected+'/'
					}
				}
				if(this.searchSelectedData != ""){
					this.searchUrlName2 = ''+this.searchSelectedData+'/'
				} else {
					this.searchUrlName2 = ''
				}
			},

			numberWithCommas(data) {
				return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		},
		watch: {
			daySelected(val){
				if(val != null){
					this.datepickerValue1 = this.dayData(val)
					this.datepickerValue2 = this.todayData()
				}
			},

			userSelected(data){
				if(data == '전체'){
					return this.userUrlName = ''
				}
				this.userUrlName = 'status/'+data+'/'
			},

			searchSelected(data){
				if(this.resetBtnSta == true){
					this.searchUrlName1 = ''
					this.resetBtnSta = false
				} else {
					this.searchUrlName1 = ''+data+'/'
				}
			},

			searchSelectedData(data){
				if(this.searchSelected == 'name'){
					if(this.resetBtnSta == true){
						this.searchUrlName1 = ''
						this.resetBtnSta = false
					} else {
						this.searchUrlName1 = ''+this.searchSelected+'/'
					}
				}
				if(data != ""){
					this.searchUrlName2 = ''+data+'/'
				}
			},

			$route (data){
				if(this.$route.query.page == undefined) return
					axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/trading/'+this.choiceSearchSelected+'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page='+this.$route.query.page+'&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
					this.totalElements = res.data.totalElements
					this.items = res.data.content
					this.totalPages = res.data.totalPages
					var num = res.data.number+1
					var lastNum = (num-1) * res.data.size + 1
					for(var i = 0; res.data.size > i; i++){
						this.items[i].no = lastNum+i
					}
				})
				.catch( err => {
					// console.log(err)
				});
			},
		}
	}

</script>

<style scoped="">
.of_cneter{padding:10px;}
.of_cneter:after{content:'';display:block;clear:both;}
.f_left{float:left;}
.f_right{float:right;}

.staStatus:hover{text-decoration:underline;cursor:pointer;}
.fc_red{color:#f00;}
.pincodeBtn{cursor:pointer;}
.pincodeModatTbl{float:left;width:100%;}
.pincodeModatTbl .name{float:left;width:20%;}
.pincodeModatTbl .code{float:left;width:80%;}
.pincodeModatTbl  > div{padding:7px;}
.from_box{padding:20px 0;margin-bottom:10px;}
.from_box input{width:100%;border:solid 1px #ddd;border-radius:5px;margin:1rem 0 2rem 0;padding:6px 10px;}
.btn.login_btn{width:100%;border-radius:0;}
.user_infor{text-align:center;}
.user_infor a{color:#444;font-size:.75em;}
.user_infor a:first-child:before{display:none;}
.user_infor a:first-child + a:before{content:'/';display:inline-block;clear:both;padding:0 5px;}
.sign_up_btn{float:left;width:100%;background-color:#fff;height:40px;line-height:40px;text-align:center;color:#444;margin-top:10px;border:solid 1px #ccc;}
/*.detail_go_btn{cursor:pointer;}*/
.pagination_cont{margin-top:30px;}
.table.table_typeA{}
.table.table_typeA tr:first-child{}
.table.table_typeA tr:first-child td:last-child{width:15%;}
.table.table_typeA td:first-child{width:120px;text-align:left;}
.table.table_typeA td{vertical-align: middle;}
.table.table_typeA td button{width:100%;margin:.3rem;}
.datepicker_list{float:left;width:200px;}
.datepicker_list select{float:left;border:1px solid #ced4da;height:38px;margin-left:1rem;font-size:1rem;color:#495057;padding:0 .7rem;}
.datepicker_list.keyword{width:120px;}
.datepicker_list.keyword select{margin:0;}
.datepicker_list.choice_search{width:160px;}
.datepicker_list.input{float:left;width:calc(100% - 120px);} 
.bluet{float:left;line-height:38px;padding:0 1rem;}
.radio_box{margin:0;}
.radio_box .custom-control.custom-radio{float:left;margin-left:.3rem;}
.radio_box .custom-control.custom-radio:first-child{margin:0;}
.form-group.sta_radio_box{margin:0;}
.form-group.sta_radio_box .btn{float:left;margin-left:20px;}
.sta_radio_box .custom-control{float:left;margin-left:10px;margin-top:4px;}

.table>tbody>tr>th{width:200px;background-color:#ededed;}
.btn_wrap.first_btn_cont{text-align:center;margin-top:30px;}
.btn_wrap.first_btn_cont .btn{width:300px;padding:10px;margin:0 1%;}

.btl_user_data >>> th:first-child > div{width:50px;}
.btl_user_data >>> th:first-child + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th > div{width:200px;}
.btl_user_data >>> th:first-child + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th > div{width:60px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}

</style>

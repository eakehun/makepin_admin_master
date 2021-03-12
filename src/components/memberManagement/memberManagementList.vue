<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>회원관리</div>
			<div v-if="detailSta != false"><b-icon-chevron-right></b-icon-chevron-right></div>
			<div v-if="detailSta != false">상세</div>
		</div>
		<div v-if="detailSta == false">
			<div>
				<table class="table b-table table_typeA">
					<caption>최근 7일</caption>
					<tbody role="rowgroup">
						<tr role="row" class="">
							<td role="cell" class="">가입일</td>
							<td role="cell" class="">
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
							<td role="cell" class="">회원상태</td>
							<td role="cell" class="">
								<b-form-group v-slot="{ ariaDescribedby }" class="radio_box">
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="전체">전체</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="정지">중지</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="탈퇴">탈퇴</b-form-radio>
								</b-form-group>
							</td>
						</tr>

						<tr role="row" class="">
							<td role="cell" class="">키워드 검색</td>
							<td role="cell" class="">
								<div class="datepicker_list keyword">
									<select name="choice" v-model="searchSelected">
										<option value="name">이름</option>
										<option value="userId">아이디</option>
										<option value="tel">휴대폰번호</option>
										<option value="idx">회원번호</option>
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
						<div class="detail_go_btn" @click="detailGo(data.item.idx, agreementList(data.item.agreementList, 'email'), agreementList(data.item.agreementList, 'sns'))">{{ data.item.idx }}</div>
					</template>

					<template #cell(agreementEmail)="data">
						{{ agreementList(data.item.agreementList, 'email') }}
					</template>
					<template #cell(agreementList)="data">
						{{ agreementList(data.item.agreementList, 'sns') }}
					</template>
					<template #cell(suspendedDate)="data">
						{{ data.item.suspendedDate == null ? '-' : data.item.suspendedDate }}
					</template>

					<template #cell(limitOver)="data">
						{{ data.item.limitOver  == null ? '한도초과' : '-' }}
					</template>
					<template #cell(withdrawDate)="data">
						{{ data.item.withdrawDate  == null ? '-' : data.item.withdrawDate }}
					</template>

					<template #cell(accountUserName)="data">
						{{ data.item.name }}
					</template>

					<template #cell(lastDevice)="data">
						{{ data.item.lastDevice  == null ? '-' : data.item.lastDevice }}
					</template>
					<template #cell(lastLogin)="data">
						{{ data.item.lastLogin  == null ? '-' : data.item.lastLogin }}
					</template>

				</b-table>
			</div>

			<div class="pagination_cont">
				<b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="totalPages" use-router align="center"></b-pagination-nav>
			</div>

		</div>

		<div v-else>

			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>회원번호</th>
						<td>{{ detailData.idx }}</td>
						<th>회원상태</th>
						<td>{{detailData.accountStatus}}</td>
					</tr>
					<tr>
						<th>아이디</th>
						<td>{{detailData.userId}}</td>
						<th>가입일</th>
						<td>{{detailData.createDate}}</td>
					</tr>
					<tr>
						<th>이름</th>
						<td>{{detailData.name}}</td>
						<th>탈퇴일</th>
						<td>{{detailData.withdrawDate == null ? '-': detailData.withdrawDate}}</td>
					</tr>
					<tr>
						<th>휴대폰번호</th>
						<td>{{detailData.tel}}</td>
						<th>정지처리</th>
						<td>{{detailData.suspendedDate == null ? '-': detailData.suspendedDate}}</td>
					</tr>
				</tbody>
			</table>

			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>이메일 수신동의</th>
						<td>{{detailData.email}}</td>
						<th>SNS 수신동의</th>
						<td>{{detailData.sns}}</td>
					</tr>
				</tbody>
			</table>

			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>은행명</th>
						<td colspan="3">{{detailData.accountName}}</td>
					</tr>
					<tr>
						<th>계좌번호</th>
						<td colspan="3">{{detailData.accountNum}}</td>
					</tr>
					<tr>
						<th>예금주명</th>
						<td colspan="3">{{detailData.name}}</td>
					</tr>
				</tbody>
			</table>

			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>최근접속일시</th>
						<td colspan="3">{{detailData.lastLogin}}</td>
					</tr>
					<tr>
						<th>총 판매요청건수</th>
						<td colspan="3">{{detailData.totalTradingCount}}</td>
					</tr>
					<tr>
						<th>총 판매완료금액</th>
						<td colspan="3">{{detailData.totalCompletePrice}}</td>
					</tr>
					<tr>
						<th>당월 판매요청건수</th>
						<td colspan="3">{{detailData.monthTradingCount}}</td>
					</tr>
					<tr>
						<th>당원 판매완료금액 </th>
						<td colspan="3">{{detailData.monthCompletePrice}}</td>
					</tr>
				</tbody>
			</table>

			<table class="table table-no-more">
				<tbody>
					<tr>
						<th>회원상태 변경</th>
						<td colspan="3">
							<b-form-group v-slot="{ ariaDescribedby }" class="sta_radio_box">
								<b-form-radio v-model="staSelect" :aria-describedby="ariaDescribedby" name="some-radios" value="정상">정상</b-form-radio>
								<b-form-radio v-model="staSelect" :aria-describedby="ariaDescribedby" name="some-radios" value="정지">계정 정지</b-form-radio>
								<b-form-radio v-model="staSelect" :aria-describedby="ariaDescribedby" disabled="disabled" name="some-radios" value="탈퇴">탈퇴</b-form-radio>
							</b-form-group>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="btn_wrap first_btn_cont">
				<b-button variant="primary" class="historyBack" @click="userChange">저장</b-button>
				<b-button variant="outline-dark" class="historyBack" @click="detailClose">닫기</b-button>
			</div>
		</div>
	</div>
</template>

<script>
	//limitOver 한도
	import { mapState, mapActions } from "vuex"
	import axios from "axios"
	export default{
		name: 'memberManagementList',
		data() {
			return {
				datepickerValue1: '',
				formatted: '',
				datepickerValue2: '',
				daySelected: null,
				searchSelectedData:'',
				searchSelected: 'name',
				userSelected: '전체',
				totalElements: 0,
				searchUrlName1: '',
				searchUrlName2: '',
				userUrlName: '',
				resetBtnSta: false,
				detailSta: false,
				detailData: '',
				staSelect: '',
				lastAxiosUrl: '',
				options: [
				{ value: null, text: '기간선택' },
				{ value: 'a', text: '오늘' },
				{ value: 'b', text: '어제' },
				{ value: 'C', text: '최근한주' },
				{ value: 'd', text: '최근한달'}
				],
				fields: [
					{ key: 'no', label: 'No.' },
					{ key: 'idx', label: '회원번호' },
					{ key: 'userId', label: '아이디' },
					{ key: 'name', label: '이름' },
					{ key: 'tel', label: '휴대폰번호' },
					{ key: 'createDate', label: '가입일' },
					{ key: 'accountStatus', label: '회원상태' },
					{ key: 'agreementEmail', label: '이메일 수신동의' },
					{ key: 'agreementList', label: 'SMS 수신동의' },
					{ key: 'limitOver', label: '한도' },
					{ key: 'withdrawDate', label: '탈퇴일' },
					{ key: 'suspendedDate', label: '정지일' },
					{ key: 'accountName', label: '은행명' },
					{ key: 'accountNum', label: '계좌번호' },
					{ key: 'accountUserName', label: '예금주명' },
					{ key: 'lastDevice', label: '접속기기' },
					{ key: 'lastLogin', label: '최근접속일시' },
				],
				items: [],
				itemsPageNum: [],
				agreement: [],
				totalPages: 1,
				currentPage: 1,
			}
		},

		mounted(){
		},

		methods: {
			...mapActions(["logOut"]),

			excelDownload(){
				var url = process.env.VUE_APP_BASE_URL + '/admin/users/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'download/'
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/users/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'download/', { withCredentials: true })
				.then( res => {
			        const link = document.createElement('a');
			        link.href = url;
			        link.setAttribute('download', '회원관리_'+this.datepickerValue1+'_'+this.datepickerValue2+'.xlsx');
			        document.body.appendChild(link);
			        link.click();
				})
				.catch( err => {
					console.log(err)
				});
			},

			agreementList(obj, type){
				var typeValue = ''
				obj.forEach(function(value, index) {
					if(value.title.indexOf('마케팅정보 수신 동의') != -1){
						typeValue = 'Y'
					} else {
						typeValue = 'N'
					}
				});
				return typeValue
			},

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
				// console.log(year + '-' + month + '-' + date)
				return year + '-' + month + '-' + date
			},

			linkGen(pageNum, info) {
				return {
					path: '/member/',
					query: {
						page: pageNum-1,
						searchText: this.searchSelectedData
					}
				}
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
				this.lastAxiosUrl = '/admin/users/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page=0&size=10&sort=idx,desc'
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/users/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page=0&size=10&sort=idx,desc', { withCredentials: true })
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

			detailGo(idx, sns, email){
				this.detailSta = true
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/users/idx/'+idx+'', { withCredentials: true })
				.then( res => {
					this.detailData = res.data
					this.detailData.sns = sns
					this.detailData.email = email
					this.staSelect = res.data.accountStatus
				})
				.catch( err => {
					console.log(err)
				});
			},

			userChange(){
				axios
				.put(process.env.VUE_APP_BASE_URL + '/admin/users/', {'idx':this.detailData.idx, 'accountStatus': this.staSelect}, { withCredentials: true })
				.then( res => {
					this.detailClose()
				})
				.catch( err => {
					console.log(err)
				});
			},

			detailClose(){
				console.log(this.items)
				console.log(this.detailData)
				console.log(this.totalPages)

				this.items.forEach (function (el, index) {
					if(this.items[index].idx == this.detailData.idx){
						this.items[index].accountStatus = this.staSelect
					}

				}.bind(this));
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
				this.$router.push({name: 'memberManagementList', path: '/member'}, function() {
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
				this.lastAxiosUrl = '/admin/users/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page='+this.$route.query.page+'&size=10&sort=idx,desc'
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/users/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page='+this.$route.query.page+'&size=10&sort=idx,desc', { withCredentials: true })
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

.from_box{padding:20px 0;margin-bottom:10px;}
.from_box input{width:100%;border:solid 1px #ddd;border-radius:5px;margin:1rem 0 2rem 0;padding:6px 10px;}
.btn.login_btn{width:100%;border-radius:0;}
.user_infor{text-align:center;}
.user_infor a{color:#444;font-size:.75em;}
.user_infor a:first-child:before{display:none;}
.user_infor a:first-child + a:before{content:'/';display:inline-block;clear:both;padding:0 5px;}
.sign_up_btn{float:left;width:100%;background-color:#fff;height:40px;line-height:40px;text-align:center;color:#444;margin-top:10px;border:solid 1px #ccc;}
.detail_go_btn{cursor:pointer;}
.pagination_cont{margin-top:30px;}
.table.table_typeA{}
.table.table_typeA tr:first-child{}
.table.table_typeA tr:first-child td:last-child{width:15%;}
.table.table_typeA td:first-child{width:120px;}
.table.table_typeA td{vertical-align: middle;}
.table.table_typeA td button{width:100%;margin:.3rem;}
.datepicker_list{float:left;width:200px;}
.datepicker_list select{float:left;border:1px solid #ced4da;height:38px;margin-left:1rem;font-size:1rem;color:#495057;padding:0 .7rem;}
.datepicker_list.keyword{width:120px;}
.datepicker_list.keyword select{width:100px;margin:0;}
.datepicker_list.input{float:left;width:calc(100% - 120px);} 
.bluet{float:left;line-height:38px;padding:0 1rem;}
.radio_box{margin:0;}
.radio_box .custom-control.custom-radio{float:left;margin-left:.3rem;}
.radio_box .custom-control.custom-radio:first-child{margin:0;}
.form-group.sta_radio_box{margin:0;}
.form-group.sta_radio_box .btn{float:left;margin-left:20px;}
.sta_radio_box .custom-control{float:left;margin-left:10px;margin-top:4px;}

.table>tbody>tr>td{text-align:left;}
.table>tbody>tr>th{width:200px;background-color:#ededed;}
.btn_wrap.first_btn_cont{text-align:center;margin-top:30px;}
.btn_wrap.first_btn_cont .btn{width:300px;padding:10px;margin:0 1%;}
.btl_user_data >>> th:first-child > div{width:50px;}
.btl_user_data >>> th:first-child + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th > div{width:200px;}
.btl_user_data >>> th:first-child + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th > div{width:200px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th > div{width:200px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th > div{width:200px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:250px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
</style>
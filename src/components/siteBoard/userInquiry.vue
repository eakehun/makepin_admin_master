<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>사이트관리</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>1:1 문의관리</div>
			<div v-if="detailSta != false"><b-icon-chevron-right></b-icon-chevron-right></div>
			<div v-if="detailSta != false">상세</div>
		</div>

		<div v-if="detailSta == false">
			<div>
				<table class="table b-table table_typeA">
					<caption>최근 7일</caption>
					<tbody role="rowgroup">
						<tr role="row" class="">
							<td role="cell" class="">일자</td>
							<td role="cell" class="">
								<div class="datepicker_list choice_search">
									<select name="choice" v-model="choiceSearchSelected">
										<option value="createDate">접수일</option>
										<option value="responseDate">답변일</option>
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
							<td role="cell" class="">문의상태</td>
							<td role="cell" class="">
								<b-form-group v-slot="{ ariaDescribedby }" class="radio_box">
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="전체">전체</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="Ready">접수</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="Response_Complate">답변완료</b-form-radio>
								</b-form-group>
							</td>
						</tr>

						<tr role="row" class="">
							<td role="cell" class="">키워드 검색</td>
							<td role="cell" class="">
								<div class="datepicker_list keyword">
									<select name="choice" v-model="searchSelected">
										<option value="userId">아이디</option>
										<option value="title">제목</option>
									</select>
								</div>
								<div class="datepicker_list input">
									<b-form-input placeholder="" v-model="searchSelectedData"></b-form-input>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div>
				<b-table responsive :items="items" :fields="fields" class="btl_user_data">
					<template #cell(No.)="data">
						{{ data.no }}
					</template>

					<template #cell(title)="data">
						<div class="detail_go_btn text-center" @click="detailGo(data.item.idx)">{{ data.item.title }}</div>
					</template>

					<template #cell(status)="data">
						<div>{{ data.item.status == 'Ready' ? '접수' : '답변완료' }}</div>
					</template>

				</b-table>
			</div>
			<div class="pagination_cont">
				<b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="totalPages" use-router align="center"></b-pagination-nav>
			</div>
		</div>
		<div v-else>

			<table class="table table-no-more type3">
				<tbody>
					<tr>
						<th>아이디</th>
						<td>{{ oneToOne.userId }}</td>
						<th>이름</th>
						<td>{{ oneToOne.userName }}</td>
					</tr>
					<tr>
						<th>휴대폰번호</th>
						<td colspan="3">{{oneToOne.tel}}</td>
					</tr>
					<tr>
						<th>상태</th>
						<td colspan="3">{{oneToOne.status == 'Response_Complate' ? '접수' : '미답변' }}</td>
					</tr>
					<tr>
						<th>접수일시</th>
						<td>{{oneToOne.createDate}}</td>
						<th>답변일시</th>
						<td>{{oneToOne.responseDate}}</td>
					</tr>
					<tr>
						<th>제목</th>
						<td colspan="3">{{oneToOne.title}}</td>
					</tr>
					<tr>
						<th>내용</th>
						<td colspan="3"><div v-html="oneToOne.content"></div></td>
					</tr>
				</tbody>
			</table>

			<table class="table table-no-more" v-if="oneToOne.status != 'Response_Complate'">
				<tbody>
					<tr>
						<th>답변하기</th>
						<td colspan="3">
							<b-form-textarea
							id="textarea-rows"
							placeholder=""
							rows="8"
							v-model="textareaData"
							v-on:input="textBytes"
							></b-form-textarea>
							<div class="max_text_cont">
								<span>{{maxTextBytes}}</span> / 2,500 byte
							</div>
						</td>
					</tr>
				</tbody>
			</table>


			<table class="table table-no-more" v-else>
				<tbody>
					<tr>
						<th>등록답변</th>
						<td colspan="3">
							<div>{{oneToOneResponses[0].createDate}}</div>
							<div>{{oneToOneResponses[0].content}}</div>	
						</td>
					</tr>
				</tbody>
			</table>

			<div class="btn_wrap first_btn_cont" v-if="oneToOne.status != 'Response_Complate'">
				<b-button variant="primary" class="historyBack" @click="oneToOneResponse">답변등록</b-button>
				<b-button variant="outline-dark" class="historyBack" @click="detailClose">닫기</b-button>
			</div>

			<div class="btn_wrap first_btn_cont" v-else>
				<b-button variant="outline-dark" class="historyBack" @click="detailClose">확인</b-button>
			</div>

		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from "vuex"
	import axios from "axios"
	export default{
		name: 'site',
		data() {
			return {
				datepickerValue1: '',
				formatted: '',
				datepickerValue2: '',
				daySelected: null,
				searchSelectedData:'',
				searchSelected: 'userId',
				userSelected: '전체',
				searchUrlName1: '',
				searchUrlName2: '',
				userUrlName: '',
				resetBtnSta: false,
				detailSta: false,
				detailData: '',
				oneToOne: '',
				oneToOneResponses: '',
				staSelect: '',
				textareaData:'',
				maxTextBytes: 0,
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
				{ key: 'userId', label: '아이디' },
				{ key: 'userName', label: '이름' },
				{ key: 'tel', label: '휴대폰번호' },
				{ key: 'title', label: '제목' },
				{ key: 'status', label: '상태' },
				{ key: 'createDate', label: '접수일시' },
				{ key: 'responseDate', label: '답변일시' },
				],
				items: [],
				itemsPageNum: [],
				totalPages: 1,
				currentPage: 1,
				detailGoIdx: 0,
			}
		},

		mounted(){
		},

		methods: {
			...mapActions(["logOut"]),

			textBytes: function(){    	
				var stringByteLength = 0;
				stringByteLength = this.textareaData.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
				this.maxTextBytes = stringByteLength
			},

			max_length : function(e, len, title, id){
				var val =  e.target.value;    			
				if (val.length > len){    				
					var msg = title + '의 최대 입력 길이는 ' + len + '입니다.';
					$(id).val(val.substring(0, len));
				}
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

				let year = day.getFullYear();
				let month = day.getMonth() + 1;
				let date = day.getDate();
				return year + '-' + month + '-' + date
			},

			linkGen(pageNum, info) {
				return {
					path: '/site/',
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
				// if(this.$router.history.current.fullPath != '/site/'){
				// 	this.$router.push({path: '/site'});
				// }
				if(this.datepickerValue1 == ''){
					this.datepickerValue1 = '2020-08-30'
					this.datepickerValue2 = this.todayData()
				}

				if(this.datepickerValue2 == ''){
					this.datepickerValue2 = this.todayData()
				}
				
				if( this.searchUrlName1 != '' && this.searchUrlName2 == '' ){
					var text = ''
					if(this.searchUrlName1 == 'userId/'){
						text = '아이디를 입력해주세요.'
					} else if(this.searchUrlName1 == 'title/'){
						text = '제목을 입력해주세요.'
					}
					this.showMsgBoxOne(text)
					return
				}
				this.totalPages = 1
				this.currentPage = 1
				if(this.$router.currentRoute.query.page != undefined) this.$router.push({query: {page: 0,searchText: this.searchSelectedData}});
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/OneToOne/'+ this.choiceSearchSelected +'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page=0&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
					this.items = res.data.content
					this.totalPages = res.data.totalPages
					var num = res.data.number+1
					var lastNum = (num-1) * res.data.size + 1
					for(var i = 0; res.data.size > i; i++){
						this.items[i].no = lastNum+i
					}
				})
				.catch( err => {
					console.log(err)
				});
			},

			detailGo(idx){
				this.detailSta = true
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/OneToOne/response/parentIdx/'+ idx +'/', { withCredentials: true })
				.then( res => {
					this.oneToOne = res.data.OneToOne
					this.oneToOneResponses = res.data.oneToOneResponses
					this.detailGoIdx = idx
				})
				.catch( err => {
					console.log(err)
				});

			},

			oneToOneResponse(){
				if(this.textareaData == ''){
					return this.showMsgBoxOne('내용 입력 후 등록해주세요.')
				}

				if(this.textareaData != ''){
					return this.showMsgBoxTwo()
				}
			},

			oneToOneUp(){
				axios
				.post(process.env.VUE_APP_BASE_URL + '/admin/board/OneToOne/response/parentIdx/'+ this.detailGoIdx +'/', {"content": this.textareaData} ,{ withCredentials: true })
				.then( res => {
					if(res.status == 200){
						this.oneToOneResponses[0] = res.data
						this.oneToOne.status = "Response_Complate"
						this.oneToOneUpBack()
					}
				})
				.catch( err => {
					console.log(err)
				});
			},

			oneToOneUpBack(){
				// createDate 접수일
				// responseDate 답변완

				// pin컴플리트 테이트 = 판매완료
				// 위드드로우 컴플리트 데이트  = 입금완료

				// /admin/board/OneToOne/createDate/fromDate/2020-08-30 16:18:00/toDate/2020-12-13 23:58:58/?page=0&size=10&sort=idx,desc
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/OneToOne/'+ this.choiceSearchSelected +'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page='+this.$route.query.page+'&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
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

			showMsgBoxTwo() {
				var stext = '';
				const h = this.$createElement
				const messageVNode = h('div', { class: ['foobar'] }, [
					h('p', { class: ['text-center mt-3'] }, ['입력하신 내용이 등록되며, 고객에게 메일로',]),
					h('p', { class: ['text-center mb-0'] }, ['발송됩니다. 진행하시겠습니까?',]),
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
						this.oneToOneUp()
					}
				})
				.catch(err => {

				})
			},


			detailClose(){
				this.textareaData = ''
				this.detailSta = false
			},

			resetSearchBtn(){
				this.resetBtnSta = true
				this.datepickerValue1 = ''
				this.datepickerValue2 = ''
				this.userSelected = '전체'
				this.daySelected = null
				this.searchSelected = 'userId'
				this.userUrlName = ''
				this.searchUrlName1 = ''
				this.searchUrlName2 = ''
				this.searchSelectedData = ''
				this.items = []
				this.totalPages = 1
				this.currentPage = 1
				this.$router.push({name: 'userInquiry', path: '/site'}, function() {
					// console.log("userInquiry 호출 완료");
				});
			},

			onContext(ctx) {
				this.formatted = ctx.selectedFormatted
			},

			inputBlur(){
				if(this.searchSelected == 'userId'){
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
				if(this.searchSelected == 'userId'){
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
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/OneToOne/'+ this.choiceSearchSelected +'/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page='+this.$route.query.page+'&size=10&sort=idx,desc', { withCredentials: true })
				.then( res => {
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
.from_box{padding:20px 0;margin-bottom:10px;}
.from_box input{width:100%;border:solid 1px #ddd;border-radius:5px;margin:1rem 0 2rem 0;padding:6px 10px;}
.btn.login_btn{width:100%;border-radius:0;}
.user_infor{text-align:center;}
.user_infor a{color:#444;font-size:.75em;}
.user_infor a:first-child:before{display:none;}
.user_infor a:first-child + a:before{content:'/';display:inline-block;clear:both;padding:0 5px;}
.sign_up_btn{float:left;width:100%;background-color:#fff;height:40px;line-height:40px;text-align:center;color:#444;margin-top:10px;border:solid 1px #ccc;}
.detail_go_btn{cursor:pointer;}
.detail_go_btn:hover{text-decoration:underline;}
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
.datepicker_list.choice_search{width:160px;}
.table>tbody>tr>th{width:13%;background-color:#ededed;vertical-align:middle;}
.table.type3 td{width:37%;text-align:left;}
.table>tbody>tr>td{text-align:left;}
.btn_wrap.first_btn_cont{text-align:center;margin-top:30px;}
.btn_wrap.first_btn_cont .btn{width:300px;padding:10px;margin:0 1%;}
.max_text_cont{float:right;padding: .3rem;}

.btl_user_data >>> th:first-child > div{width:50px;}
.btl_user_data >>> th:first-child + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th > div{width:200px;}
.btl_user_data >>> th:first-child + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th > div{width:60px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th > div{width:60px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th > div{width:250px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th > div{width:250px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th > div{width:250px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:100px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:250px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}

</style>
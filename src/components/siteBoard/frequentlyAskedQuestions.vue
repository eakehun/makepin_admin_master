<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>사이트관리</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>FAQ 관리</div>
			<div v-if="detailSta != false"><b-icon-chevron-right></b-icon-chevron-right></div>
			<div v-if="detailSta != false">상세</div>
		</div>

		<div v-if="detailSta == false">
			<div>
				<table class="table b-table table_typeA">
					<caption>최근 7일</caption>
					<tbody role="rowgroup">
						<tr role="row" class="">
							<td role="cell" class="">등록일자</td>
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
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="true">노출</b-form-radio>
									<b-form-radio v-model="userSelected" :aria-describedby="ariaDescribedby" name="some-radios" value="false">미노출</b-form-radio>
								</b-form-group>
							</td>
						</tr>

						<tr role="row" class="">
							<td role="cell" class="">키워드 검색</td>
							<td role="cell" class="">
								<div class="datepicker_list keyword">
									<select name="choice" v-model="searchSelected">
										<option value="null">선택</option>
										<option value="title">제목</option>
										<option value="content">내용</option>
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
				<b-button variant="outline-dark" class="f_right" size="sm" to="/site/frequentlyAskedQuestionsWriting">등록하기</b-button>
			</div>

			<div>
				<b-table responsive :items="items" :fields="fields">
					<template #cell(No.)="data">
						{{ data.no }}
					</template>

					<template #cell(userId)="data">
						{{ data.item.userId }}
					</template>

					<template #cell(title)="data">
						<div class="detail_go_btn" @click="detailGo(data.item.idx)">{{ data.item.title }}</div>
					</template>
					
					<template #cell(display)="data">
						{{ data.item.display == true ? '노출' : '미노출' }}
					</template>
					
					<template #cell(createDate)="data">
						{{ data.item.createDate }}
					</template>
					<template #cell(updateDate)="data">
						{{ data.item.updateDate }}
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
						<th>제목</th>
						<td colspan="3">{{ detailData.title }}</td>
					</tr>
					<tr>
						<th>작성일시</th>
						<td>{{detailData.createDate}}</td>
						<th>최종수정일시</th>
						<td>{{detailData.updateDate}}</td>
					</tr>
					<tr>
						<th>노출여부</th>
						<td colspan="3">
							<b-form-group v-slot="{ ariaDescribedby }" class="radio_box">
								<b-form-radio v-model="detailData.display" :aria-describedby="ariaDescribedby" disabled="disabled" name="some-radios2" value="true">노출</b-form-radio>
								<b-form-radio v-model="detailData.display" :aria-describedby="ariaDescribedby" disabled="disabled" name="some-radios2" value="false">미노출</b-form-radio>
							</b-form-group>
						</td>
					</tr>
					<tr>
						<th>내용</th>
						<td colspan="3">
							<div class="detail_cont" v-html="detailData.content"></div>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="btn_wrap first_btn_cont">
				<b-button variant="primary" class="historyBack" @click="detailModify(detailData.idx)">수정하기</b-button>
				<b-button variant="outline-dark" class="historyBack" @click="detailClose">확인</b-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from "vuex"
	import axios from "axios"
	export default{
		name: 'frequentlyAskedQuestions',
		data() {
			return {
				datepickerValue1: '',
				formatted: '',
				datepickerValue2: '',
				daySelected: null,
				searchSelectedData:'',
				searchSelected: 'null',
				userSelected: '전체',
				searchUrlName1: '',
				searchUrlName2: '',
				userUrlName: '',
				totalElements: 0,
				resetBtnSta: false,
				detailSta: false,
				detailData: '',
				staSelect: '',
				options: [
				{ value: null, text: '기간선택' },
				{ value: 'a', text: '오늘' },
				{ value: 'b', text: '어제' },
				{ value: 'C', text: '최근한주' },
				{ value: 'd', text: '최근한달'}
				],
				fields: [
					{ key: 'no', label: 'No.' },
					{ key: 'userId', label: '작성자' },
					{ key: 'title', label: '제목' },
					{ key: 'display', label: '노출여부' },
					{ key: 'createDate', label: '등록일' },
					{ key: 'updateDate', label: '최종수정일' },
				],
				items: [],
				itemsPageNum: [],
				totalPages: 1,
				currentPage: 1,
			}
		},

		mounted(){
			if(this.$route.query.idx != undefined){
				this.detailGo(this.$route.query.idx)
			}
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
					path: '/site/frequentlyAskedQuestions',
					query: {
						page: pageNum-1,
						searchText: this.searchSelectedData
					}
				}
			},

			detailModify(idxNum){
				this.$router.push({name: 'frequentlyAskedQuestionsModify', path: '/site/frequentlyAskedQuestionsModify', query: {idx: idxNum}});
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
				
				if(this.searchUrlName1 != 'null'){
					if(this.searchUrlName1 != '' && this.searchUrlName2 == '' ){
						var text = ''
						if(this.searchUrlName1 == 'title/'){
							text = '제목을 입력해주세요.'
						} else if(this.searchUrlName1 == 'content/'){
							text = '내용를 입력해주세요.'
						}
						this.showMsgBoxOne(text)
						return
					}
				}
				this.totalPages = 1
				this.currentPage = 1
				if(this.$router.currentRoute.query.page != undefined) this.$router.push({query: {page: 0,searchText: this.searchSelectedData}});

				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/faq/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page=0&size=10&sort=idx,desc', { withCredentials: true })
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

			detailGo(idx){
				this.detailSta = true
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/faq/idx/'+idx+'/', { withCredentials: true })
				.then( res => {
					this.detailData = res.data
				})
				.catch( err => {
					// console.log(err)
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
				this.searchSelected = 'null'
				this.userUrlName = ''
				this.searchUrlName1 = ''
				this.searchUrlName2 = ''
				this.searchSelectedData = ''
				this.items = []
				this.totalPages = 1
				this.currentPage = 1
				this.$router.push({name: 'frequentlyAskedQuestions', path: '/site/frequentlyAskedQuestions'}, function() {
					// console.log("frequentlyAskedQuestions 호출 완료");
				});
			},

			onContext(ctx) {
				this.formatted = ctx.selectedFormatted
			},

			inputBlur(){
				if(this.searchSelected == 'null'){
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
				this.userUrlName = 'display/'+data+'/'
			},

			searchSelected(data){
				if(data == 'null'){
					this.resetBtnSta == true
					this.searchUrlName1 = ''
				} else {
					if(this.resetBtnSta == true){
						this.searchUrlName1 = ''
						this.resetBtnSta = false
					} else {
						this.searchUrlName1 = ''+data+'/'
					}
				}
				
			},

			searchSelectedData(data){
				if(this.searchSelected == 'null'){
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
					// console.log(this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName)
					axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/faq/fromDate/'+this.datepickerValue1+' 00:00:00/toDate/'+this.datepickerValue2+' 23:58:58/'+this.searchUrlName1+this.searchUrlName2+this.userUrlName+'?page='+this.$route.query.page+'&size=10&sort=idx,desc', { withCredentials: true })
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

.detail_cont{min-height:350px;}
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
.datepicker_list.keyword select{margin:0;}
.datepicker_list.input{float:left;width:calc(100% - 120px);} 
.bluet{float:left;line-height:38px;padding:0 1rem;}
.radio_box{margin:0;}
.radio_box .custom-control.custom-radio{float:left;min-width:70px;margin-left:.3rem;}
.radio_box .custom-control.custom-radio:first-child{margin:0;}
.form-group.sta_radio_box{margin:0;}
.form-group.sta_radio_box .btn{float:left;margin-left:20px;}
.sta_radio_box .custom-control{float:left;margin-left:10px;margin-top:4px;}

.table>tbody>tr>td{text-align:left;}
.table>tbody>tr>th{width:200px;background-color:#ededed;}
.btn_wrap.first_btn_cont{text-align:center;margin-top:30px;}
.btn_wrap.first_btn_cont .btn{width:300px;padding:10px;margin:0 1%;}
</style>
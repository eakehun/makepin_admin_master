<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>조회하기</div>
		</div>

		<table class="table table-no-more">
			<tbody>
				<tr>
					<th>브랜드 선택</th>
					<td>
						<b-form-group v-slot="{ ariaDescribedby }" class="sta_radio_box">
							<b-form-radio v-model="selectCompany" :aria-describedby="ariaDescribedby" name="some-radios" value="culture">컬처랜드</b-form-radio>
							<b-form-radio v-model="selectCompany" :aria-describedby="ariaDescribedby" name="some-radios" value="happy">해피머니</b-form-radio>
						</b-form-group>
					</td>
				</tr>
			</tbody>
		</table>

		<div>
			<table class="table b-table table_typeS">
				<caption>최근 7일</caption>
				<tbody role="rowgroup">
					<tr role="row" class="">
						<td role="cell" class="">
							<b-form-textarea
							id="textarea"
							v-model="text"
							placeholder=""
							rows="10"
							max-rows="6"
							></b-form-textarea>
						</td>
						<td role="cell" class="" rowspan="3">
							<b-button variant="outline-primary" size="sm" @click="pinCodeSearch">검색</b-button>
							<b-button variant="outline-dark" size="sm">초기화</b-button>
						</td>
					</tr>

				</tbody>
			</table>
		</div>
		<div class="of_cneter">
			<div class="f_left">총 <span>{{totalElements}}</span> 건</div>
			<b-button variant="outline-dark" class="f_right" size="sm" to="/site/frequentlyAskedQuestionsWriting">엑셀다운로드</b-button>
		</div>
		<div>
			<b-table responsive :items="items" :fields="fields" class="btl_user_data">
				<template #cell(No.)="data">
					{{ data.no }}
				</template>

				<template #cell(idx)="data">
					<div class="detail_go_btn">{{ data.item.idx }}</div>
				</template>

				<template #cell(company)="data">
					{{ data.item.company == 'culture' ? '컬처랜드' : '해피머니' }}
				</template>

			</b-table>
		</div>
		<div class="pagination_cont">
			<b-pagination-nav v-model="currentPage" :link-gen="linkGen" :number-of-pages="totalPages" use-router align="center"></b-pagination-nav>
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	export default {
		name: 'searchList',
		data() {
			return {
				selectCompany: 'culture',
				text: '',
				fields: [
				{ key: 'no', label: 'No.' },
				{ key: 'idx', label: '아이디' },
				// { key: 'userId', label: '이름' },
				{ key: 'company', label: '상품권구분' },
				// { key: 'tel', label: '휴대폰번호' },
				{ key: 'pinCode', label: '핀번호' },
				{ key: 'price', label: '판매요청금액' },
				{ key: 'fees', label: '수수료' },
				{ key: 'completePrice', label: '입금금액' },
				{ key: 'accountName', label: '입금은행' },
				{ key: 'accountNum', label: '계좌번호' },
				],
				items: [],
				itemsPageNum: [],
				totalPages: 1,
				currentPage: 1,
				pinCodeData: '',
				totalElements: 0,
			}
		},
		mounted(){
		},
		methods: {
			linkGen(pageNum, info) {
				return {
					path: '/member/',
					query: {
						page: pageNum-1,
						searchText: this.searchSelectedData
					}
				}
			},

			pinCodeSearch(){
				if(this.selectCompany == 'culture'){
					this.culturePinAutoNum()
				} else {
					this.happyPinAutoNum()
				}
			},

			numberDataCh(event){
				if(event.key.replace(/[^0-9]/g, '') == ''){
					event.returnValue=false;
				}
			},

			culturePinAutoNum(pinNum){
				var patten = /([0-9]{16,18})|([0-9]{4})-([0-9]{4})-([0-9]{4})-([0-9]{4,6})|([0-9]{4})\s([0-9]{4})\s([0-9]{4})\s([0-9]{4,6})/g;
				var auto_text = this.text
				var gift_pin_array = auto_text.match(patten);
				var gift_pin_result = new Array();
				var newlistData = new Array();

				if(gift_pin_array == null){
					return alert("핀번호 및 상품권 종류 확인 후 다시 시도해주세요.");
				}
				var value_replace = '';

				gift_pin_array.forEach(function(value, index) {
					value_replace = value.replace(/(\s*)/g, "");
					// value_replace = value_replace.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g,"");
					value_replace = value_replace.replaceAll('-', '')
					gift_pin_result.push(value_replace);
				}.bind(this));

				this.pinCodeData = gift_pin_result
				console.log(gift_pin_result)
				this.pinCodeSearchData()
			},

			happyPinAutoNum(pinNum){
				var pinInputName = 'pin_auto_'+this.selected
				var auto_text = this.text

				var patten = /([0-9]{16,24})/g;

				var auto_text = this.text
				var gift_pin_array = auto_text.match(patten);
				var gift_pin_result = new Array();
				var value_replace = '';
				var newlistData = new Array();

				// if(gift_pin_array == null){
				// 	return alert("핀번호 및 상품권 종류 확인 후 다시 시도해주세요.");
				// }
				console.log(123)
				gift_pin_array.forEach(function(value, index) {
					value_replace = value.replace(/(\s*)/g, "");
					value_replace = value_replace.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g,"");
					gift_pin_result.push(value_replace);
				}.bind(this));
				this.pinCodeData = gift_pin_result
				console.log(gift_pin_result)
				this.pinCodeSearchData()
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

			pinCodeSearchData(){
				axios
				.post(process.env.VUE_APP_BASE_URL + '/admin/pinCode/?page=0&size=10&sort=idx,desc', this.pinCodeData ,{ withCredentials: true })
				.then( res => {
					this.items = res.data
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
					// console.log(err)
				});	
			}

		},

		watch: {
			selectCompany(val){
				pinCodeData: ''
			},

		}
	}
</script>

<style scoped="">

.btl_user_data table th{text-align:center}
.of_cneter{padding:10px;}
.of_cneter:after{content:'';display:block;clear:both;}
.f_left{float:left;}
.f_right{float:right;}

.table.table_typeS td{vertical-align:top;}
.table.table_typeS td:first-child{width:80%;}
.table.table_typeS td button{width:100%;margin:.3rem;}

.table>tbody>tr>th{width:200px;background-color:#ededed;}
.fee_list.input{float:left;width:200px;}
.fee_list.input + span{float:left;line-height:38px;margin-left:10px;}
.table>tbody>tr>td{text-align:left;}
.btn_wrap1{text-align:center;}
.form-group.sta_radio_box{margin:0;}
.form-group.sta_radio_box .btn{float:left;margin-left:20px;}
.sta_radio_box .custom-control{float:left;margin-left:10px;margin-top:4px;}

/*
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
.btl_user_data >>> th:first-child + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th + th > div{width:150px;}*/

</style>
<template>
	<div>
		<div class="admin_nav after">
			<div>Home</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>FAQ 관리</div>
			<div><b-icon-chevron-right></b-icon-chevron-right></div>
			<div>수정하기</div>
		</div>

		<table class="table table-no-more">
			<tbody>
				<tr>
					<th>제목</th>
					<td colspan="3"><b-form-input placeholder="" v-model="detailData.title"></b-form-input></td>
				</tr>
				<tr>
					<th>작성일시</th>
					<td>-</td>
					<th>최종수정일시</th>
					<td>-</td>
				</tr>
				<tr>
					<th>노출여부</th>
					<td colspan="3">
						<b-form-group v-slot="{ ariaDescribedby }" class="radio_box">
							<b-form-radio v-model="detailData.display" :aria-describedby="ariaDescribedby" name="some-radios2" value="true">노출</b-form-radio>
							<b-form-radio v-model="detailData.display" :aria-describedby="ariaDescribedby" name="some-radios2" value="false">미노출</b-form-radio>
						</b-form-group>
					</td>
				</tr>
				<tr>
					<th>내용</th>
					<td colspan="3">
						<ckeditor :editor="editor" v-model="detailData.content" :config="editorConfig" @ready="onEditorReady"></ckeditor>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="btn_wrap first_btn_cont">
			<b-button variant="primary" class="historyBack" @click="uploadData">수정하기</b-button>
			<b-button variant="outline-dark" class="historyBack" @click="history_back">닫기</b-button>
		</div>
	</div>
</template>

<script>
	import { mapState, mapActions } from "vuex"
	import axios from "axios"

	import CKEditor from '@ckeditor/ckeditor5-vue'
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

	export default{
		name: 'frequentlyAskedQuestionsModify',
		data() {
			return {
				datepickerValue1: '',
				formatted: '',
				datepickerValue2: '',
				daySelected: null,
				searchSelectedData:'',
				totalElements: 0,
				searchSelected: 'title',
				userSelected: '전체',
				fixedSelected: '전체',
				searchUrlName1: '',
				searchUrlName2: '',
				displayName: '',
				fixedUrlName: '',
				resetBtnSta: false,
				textareaData: '',
				maxTextBytes: 0,
				detailSta: false,
				detailData: '',
				staSelect: '',
				editor: ClassicEditor,
				editorConfig: {
					extraPlugins: [MyCustomUploadAdapterPlugin],
					toolbar: [
			          "bold",
			          "italic",
			          "|",
			          "ImageUpload",
			          "|",
			          "undo",
			          "redo"
			        ],
				},
				editorData: '<p></p>',
			}
		},

		mounted(){
			this.detailGo(this.$route.query.idx)
		},

		methods: {
			...mapActions(["logOut"]),

			history_back(){
				this.showMsgBoxTwo2()
			},

			onEditorReady(editor){
				editor.editing.view.change( writer => {
				    writer.setStyle( 'height', '350px', editor.editing.view.document.getRoot() );
				} );
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

			showMsgBoxTwo() {
				var stext = '';
				var targetData = new Object()
				const h = this.$createElement
				const messageVNode = h('div', { class: ['foobar'] }, [
					h('p', { class: ['text-center mt-3'] }, ['등록하시겠습니까?',]),
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
						this.uploadData()
					}
				})
				.catch(err => {

				})
			},

			showMsgBoxTwo2() {
				var stext = '';
				var targetData = new Object()
				const h = this.$createElement
				const messageVNode = h('div', { class: ['foobar'] }, [
					h('p', { class: ['text-center mt-3'] }, ['변경내용 반영없이 리스트로 이동합니다',]),
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
						this.$router.go(-1)
					}
				})
				.catch(err => {

				})
			},

			detailGo(idx){
				this.detailSta = true
				axios
				.get(process.env.VUE_APP_BASE_URL + '/admin/board/faq/idx/'+idx+'/', { withCredentials: true })
				.then( res => {
					this.detailData = res.data
				})
				.catch( err => {
					console.log(err)
				});
			},

			uploadData(){
				axios
				.put(process.env.VUE_APP_BASE_URL+'/admin/board/faq/', this.detailData, { withCredentials: true })
				.then(function (response) {
					this.$router.push({name: 'frequentlyAskedQuestions', path: '/site/frequentlyAskedQuestions', query: {idx: response.data.idx}});
				}.bind(this))
				.catch(function (error) {
					// console.log(error);
				});
			},

		},
		watch: {
			$route (data){
				// console.log(data)
			},
		}
	}

	class UploadAdapter {
		constructor(loader) {
			this.loader = loader;
		}

		upload() {
			return this.loader.file.then( file => new Promise(((resolve, reject) => {
				this._initRequest();
				this._initListeners( resolve, reject, file );
				this._sendRequest( file );
			})))
		}

		abort() { //업로드 취소
			if ( this.xhr ) { this.xhr.abort(); } 
		}

		_initRequest() {
			const xhr = this.xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://'+process.env.VUE_APP_BUCKET+'.s3.'+process.env.VUE_APP_REGION+'.amazonaws.com/upload/', true);
			xhr.responseType = 'json';
		}

		_initListeners(resolve, reject, file) {
			const xhr = this.xhr;
			const loader = this.loader;
			const genericErrorText = '파일을 업로드 할 수 없습니다.'
			xhr.addEventListener('error', () => {reject(genericErrorText)})
			xhr.addEventListener('abort', () => reject())

			xhr.addEventListener('load', () => {
				const response = xhr.response
				if(!response || response.error) {
					return reject( response && response.error ? response.error.message : genericErrorText );
				}
			})

			AWS.config.update({
				region: process.env.VUE_APP_REGION,
				credentials: new AWS.CognitoIdentityCredentials({
					IdentityPoolId: process.env.VUE_APP_IdentityPoolId
				})
			})
			const s3 = new AWS.S3({
				apiVersion: '2006-03-01',
				params: {
					Bucket: process.env.VUE_APP_BUCKET
				}
			})

			let photoKey = 'upload/'+file.name
			s3.upload({
				Key: photoKey,
				Body: file,
				ACL: 'public-read'
			}, (err, data) => {
				if (err) {
					return console.log('There was an error uploading your photo: ', err.message);
				}
				resolve({
					default: data.Location
				})
			});
		}

		_sendRequest(file) {
			// AWS.config.update({
			// 	region: process.env.VUE_APP_REGION,
			// 	credentials: new AWS.CognitoIdentityCredentials({
			// 		IdentityPoolId: process.env.VUE_APP_IdentityPoolId
			// 	})
			// })
			// const s3 = new AWS.S3({
			// 	apiVersion: '2006-03-01',
			// 	params: {
			// 		Bucket: process.env.VUE_APP_BUCKET
			// 	}
			// })

			// let photoKey = 'upload/'+file.name
			// s3.upload({
			// 	Key: photoKey,
			// 	Body: file,
			// 	ACL: 'public-read'
			// }, (err, data) => {
			// 	if (err) {
			// 		return console.log('There was an error uploading your photo: ', err.message);
			// 	}
			// });
		}
	}

	function MyCustomUploadAdapterPlugin(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			return new UploadAdapter(loader)
		}
	}

</script>

<style scoped="">
.detail_cont{min-height:350px;}
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
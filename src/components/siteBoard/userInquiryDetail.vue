<template>
	<div>
		<div class="giftcard_progress_title">
			<div class="mb-md-5 pb-5 pt-5 container">
				<h3>1:1문의 / 글쓰기</h3>
				<div>1:1문의 / 글쓰기</div>
			</div>
		</div>
		<b-container class="mt-md-5 mt-4 mb-md-5 mb-4">
			<table>
				<caption>1:1 문의 쓰기</caption>
				<tbody>
					<tr>
						<th>제목</th>
						<td><b-form-input v-model="userWritingData.title" placeholder=""></b-form-input></td>
					</tr>
					<tr>
						<th>내용</th>
						<td><ckeditor :editor="editor" v-model="userWritingData.content" :config="editorConfig" @ready="onEditorReady"></ckeditor></td>
					</tr>
					<tr>
						<th>답변수신메일</th>
						<td></td>
					</tr>
				</tbody>
			</table>

			<div class="btn_wrap">
				<button type="button" class="btnn" @click="historyBack">취소하기</button>
				<button type="button" class="btnn grd" @click="uploadData">등록하기</button>
			</div>
		</b-container>
	</div>
</template>
<script>
	import axios from "axios"
	import AWS from 'aws-sdk'
	import CKEditor from '@ckeditor/ckeditor5-vue'
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

	export default {
		name: 'userInquiryWriting',
		data () {
			return {
				file: null,
				albumBucketName: process.env.VUE_APP_BUCKET,
				bucketRegion: process.env.VUE_APP_REGION,
				IdentityPoolId: process.env.VUE_APP_IdentityPoolId,
				fileList:[],
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
				editorData: '<p>Content of the editor.</p>',
				userWritingData: {
					title: '',
					content: '',
				},
			}
		},

		created () {
			
		},
		mounted() { 
			
		},

		methods: {
			historyBack(){
				this.$router.go(-1)
			},
			onEditorReady(editor){
				editor.editing.view.change( writer => {
				    writer.setStyle( 'height', '350px', editor.editing.view.document.getRoot() );
				} );
			},

			uploadData(){
				axios
				.post(process.env.VUE_APP_BASE_URL+'/users/board/OneToOne/', this.userWritingData, { withCredentials: true })
				.then(function (response) {
					this.$router.push({name: 'userInquiry', path: 'userInquiry'}, function() {
						// console.log("userInquiry 호출 완료");
					});
				}.bind(this))
				.catch(function (error) {
					console.log(error);
				});
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
​
<style scoped="">
.giftcard_progress_title{background-color:#ededed;}
table{width:100%;}
caption{display:none;}
table th{font-weight:400;width:120px;}
table tbody tr td:first-child{}
.btn_wrap{text-align:center;}
.btnn{min-width:35%;height:50px;margin:0 2%;line-height:50px;display:inline-block;border-radius:2em;border:1px solid rgba(0,0,0,.08);box-shadow:0 1px 6px 0 rgba(0,0,0,.1);background:#fff;font-weight:500;color:#444;font-size:.85rem;text-align:center;vertical-align:middle;cursor:pointer;overflow:visible;white-space:nowrap}
.btnn.grd{background-color:#498ceb;background-image:linear-gradient(45deg,#498dec 0,#6729a7 95%);box-shadow:0 1px 6px 0 rgb(94 67 183);color:#fff;border:0}
.mobile .btn_wrap{margin-top:1rem;}
.mobile table th{display:none;}
.mobile table td{padding:5px 0;}
.mobile .search_cont .form-control{padding:5px;}
:host ::ng-deep .ck-editor__editable_inline {
    min-height: 500px;
}
</style>
<template>
	<div>
		memberManagementDetail
	</div>
	
</template>
<script>
	import axios from "axios"
	export default{
		name: 'memberManagementDetail',
		data() {
			return {
				
			}
		},
		mounted(){
			console.log(this.$route.query.idx)
		},
		methods: {
			
		},
		watch: {
			
		}
	}
</script>

<style scoped="">
h5{padding:5px;}

</style>
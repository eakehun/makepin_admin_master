<template>
    <div id="defaultFooter" class="defaultFooter" :class='{ hidden_cont: not_footer }'>
        <div class="footer_sub_infor">
            Copyrights© 2020 All Rights Reserved.
        </div>
    </div>
</template>

<script>
    export default {
        name: 'defaultFooter',
        data() {
            return {
                logoImg: require('@/assets/images/main_pin_flogo.png'),
                not_footer: false,
            }
        },
        created() {
            this.diveceHiddenChecked();
        },
        methods: {
            diveceHiddenChecked(){
                if(this.$route.name == 'logInFrom'){
                    this.not_footer = true;
                } else {
                    this.not_footer = false;
                }
            }
        },
        watch: {
            $route (data){
                this.diveceHiddenChecked();
            },

            not_footer(params){
                this.diveceHiddenChecked();
            }
        }
    }
</script>

<style scoped>
.defaultFooter{float:left;width:calc(100% - 320px);margin-left:320px;border-top:solid 1px #eee;padding:20px;}
.after:after{content:'';display:block;clear:both;}
.defaultFooter.hiddenCont{display:none;}
.footer_sub_infor{border-bottom:solid 1px #ccc;}
.footer_infor_menu{margin:0 auto;text-align:right;}
.footer_infor_menu a{display:inline-block;padding:10px;color:#444;font-size:.85em;position:relative;}
.footer_infor_menu a:first-child:after,
.terms_menu a:first-child:after{display:none;}
.footer_infor_menu a:after,
.terms_menu a:after{content:'';display:block;clear:both;width:1px;height:14px;background-color:#ccc;position:absolute;top:50%;left:0;margin-top:-7px;}
.terms_menu a:first-child:after{display:none;}
.footer_company{margin:0 auto;padding:25px 15px;}
.footer_company_top{}
.footer_company_top:after{content:'';display:block;clear:both;}
.f_logo{float:left;width:100px;}
.f_logo img{float:left;width:100%;padding:8px 0 9px 0;}
.terms_menu{float:left;width:calc(100% - 120px);margin-left:20px;}
.terms_menu a{float:left;padding:10px;position:relative;color:#444;font-size:.85em;}
.terms_menu a:after{content:'';display:block;clear:both;width:1px;height:14px;background-color:#ccc;position:absolute;top:50%;left:0;margin-top:-7px;}
.terms_menu a:first-child:after{display:none;}
.footer_company_bottom{font-size:.75em;color:#777;line-height:1.5em;}
.hidden_cont{display:none;}

</style>
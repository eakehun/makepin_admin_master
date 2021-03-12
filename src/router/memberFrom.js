import memberBody from '@/views/member'//회원관리
import memberManagementList from '@/components/memberManagement/memberManagementList'//회원관리 리스트
import memberManagementDetail from '@/components/memberManagement/memberManagementDetail'//회원관리 상세
import store from "../store"

export default [
    {
        path: '/member',
        component: memberBody,
        children: [
            {
                path: '',
                name: 'memberManagementList',
                component: memberManagementList,
                query:{
                    page: 0,
                    searchText:''
                }
            },
            {
                path: 'memberManagementDetail',
                name: 'memberManagementDetail',
                component: memberManagementDetail,
                query:{
                    idx: 0,
                }
            }
        ]
    }
]
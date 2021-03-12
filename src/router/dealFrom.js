import dealBody from '@/views/deal'//판매거래
import transactionHistoryList from '@/components/transactionHistory/transactionHistoryList'//거래내역
import feeManagement from '@/components/transactionHistory/feeManagement'//수수료관리
import store from "../store"
export default [
    {
        path: '/deal',
        component: dealBody,
        children: [
            {
                path: '',
                name: 'transactionHistoryList',
                component: transactionHistoryList,
                query:{
                    page: 0,
                    searchText:''
                }
            },
            {
                path: 'feeManagement',
                name: 'feeManagement',
                component: feeManagement,
                query:{
                    idx : 0,
                }
            }
        ]
    }
]
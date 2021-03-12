import searchBody from '@/views/search'
import searchList from '@/components/search/searchList'
import store from "../store"

export default [
    {
        path: '/search',
        component: searchBody,
        children: [
            {
                path: '',
                name: 'searchList',
                component: searchList
            }
        ]
    }
]
 

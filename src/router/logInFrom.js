import logInBody from '@/views/logIn'
import logInFrom from '@/components/memBer/logInFrom'
import store from "../store"

export default [
    {
        path: '/logIn',
        component: logInBody,
        children: [
            {
                path: '',
                name: 'logInFrom',
                component: logInFrom
            },
        ]
    }
]
 

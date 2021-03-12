import siteBody from '@/views/site'
import userInquiry from '@/components/siteBoard/userInquiry'
import userInquiryDetail from '@/components/siteBoard/userInquiryDetail'
import noticeBoard from '@/components/siteBoard/noticeBoard'
import noticeBoardWriting from '@/components/siteBoard/noticeBoardWriting'
import noticeBoardModify from '@/components/siteBoard/noticeBoardModify'
import frequentlyAskedQuestions from '@/components/siteBoard/frequentlyAskedQuestions'
import frequentlyAskedQuestionsDetail from '@/components/siteBoard/frequentlyAskedQuestionsDetail'
import frequentlyAskedQuestionsModify from '@/components/siteBoard/frequentlyAskedQuestionsModify'
import frequentlyAskedQuestionsWriting from '@/components/siteBoard/frequentlyAskedQuestionsWriting'
import serviceHistory from '@/components/siteBoard/serviceHistory'
import serviceHistoryDetail from '@/components/siteBoard/serviceHistoryDetail'
import store from "../store"

export default [
    {
        path: '/site',
        component: siteBody,
        children: [
            {
                path: '',
                name: 'userInquiry',
                component: userInquiry
            },
            {
                path: 'userInquiryDetail',
                name: 'userInquiryDetail',
                component: userInquiryDetail,
                query:{
                    idx : 0,
                    page: 0
                }
            },
            {
                path: 'noticeBoard',
                name: 'noticeBoard',
                component: noticeBoard,
                query:{
                    idx : 0
                }
            },
            {
                path: 'noticeBoardWriting',
                name: 'noticeBoardWriting',
                component: noticeBoardWriting,
                query:{
                    page: 0,
                    searchText:''
                }
            },
            {
                path: 'noticeBoardModify',
                name: 'noticeBoardModify',
                component: noticeBoardModify,
                query:{
                    page: 0,
                    searchText:''
                }
            },
            {
                path: 'frequentlyAskedQuestions',
                name: 'frequentlyAskedQuestions',
                component: frequentlyAskedQuestions
            },
            {
                path: 'frequentlyAskedQuestionsDetail',
                name: 'frequentlyAskedQuestionsDetail',
                component: frequentlyAskedQuestionsDetail,
                query:{
                    user: false,
                }
            },
            {
                path: 'frequentlyAskedQuestionsModify',
                name: 'frequentlyAskedQuestionsModify',
                component: frequentlyAskedQuestionsModify,
                query:{
                    idx : 0
                }
            },
            {
                path: 'frequentlyAskedQuestionsWriting',
                name: 'frequentlyAskedQuestionsWriting',
                component: frequentlyAskedQuestionsWriting,
                query:{
                    idx : 0
                }
            },
            {
                path: 'serviceHistory',
                name: 'serviceHistory',
                component: serviceHistory,
                query:{
                    user: false,
                }
            },
            {
                path: 'serviceHistoryDetail',
                name: 'serviceHistoryDetail',
                component: serviceHistoryDetail,
                query:{
                    user: false,
                }
            }
        ]
    }
]


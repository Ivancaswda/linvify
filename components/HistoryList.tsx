'use client'
import React, {useEffect, useState} from 'react'


import axios from "axios";
import HistoryTable from "@/components/HistoryTable";
import {props} from "@/app/dashboard/language-agent/[sessionId]/[userEmail]/page";
import {useAuth} from "@/context/useAuth";
import {Loader2Icon} from "lucide-react";

const HistoryList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [historyList, setHistoryList] = useState<props[]>([])
    const {user} = useAuth()
    useEffect(() => {
        if (user) {
            getHistoryList()
            console.log('sgagasags')
        }

    }, [user])


    const getHistoryList = async () => {

        if (!user) {
            return
        }
        setLoading(true)

        const result = await axios.get(`/api/session-chat?sessionId=all&userEmail=${user?.email}`)
        console.log(result.data + 'history data!')

        setHistoryList(result.data)
        setLoading(false)
    }

    console.log(historyList.length)
    console.log('sgagsgas')



    return user && !loading ? (
        <div className='mt-10 w-[66%] '>
            {historyList.length === 0 ? <div className='flex items-center flex-col p-7 border-dashed rounded-xl justify-center gap-5'>
                <img src='https://i.pinimg.com/736x/23/ff/99/23ff9974ade813c4ae827d0253d8c4d0.jpg' alt='med-assistant' className='rounded-xl' width={200} height={200}/>
                <h2 className='font-semibold text-xl'>Нет недавних бесед</h2>
                <p className='text-center text-sm text-gray-500'>Вы пока еще не спрашивали вопросы и не вели беседы. Нажмите на кнопку начать диалог если хотите составить языковой план или выберите нужный язык для практичного разговора с нашим AI</p>


            </div> : <div>
                <HistoryTable historyList={historyList}/>

            </div>}
        </div>
    ) : <div className='text-center flex items-center justify-center'>
        <Loader2Icon className='animate-spin'/>
    </div>
}
export default HistoryList

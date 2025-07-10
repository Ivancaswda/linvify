'use client'
import React, {useEffect, useState} from 'react'
import {useAuth} from '@/context/useAuth'
import axios from "axios";
import {useRouter} from "next/navigation";
import {FocusCards} from "@/components/ui/focus-cards";
import {cards} from "@/constants";
import {Loader2Icon} from "lucide-react";
import Navbar from "@/components/Navbar";
import {Button} from "@/components/ui/stateful-button";
import HistoryList from "@/components/HistoryList";

const Page = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {  loading, user } = useAuth()
    const router = useRouter()
    console.log(user)

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/sign-in');
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className='flex items-center justify-center h-[100vh] w-full'>
                <Loader2Icon className='animate-spin text-orange-600' />
            </div>
        )
    }





    const onStartConsultation = async () =>{
        setIsLoading(true)

        if (!user) {
            return
        }

        const result = await axios.post('/api/session-chat', {
            notes: 'Новая консультация',
            user: user
        })
        console.log(result.data)
        if (result?.data?.sessionId) {
            console.log(result.data.sessionId)
            router.push(`/dashboard/language-agent/${result.data.sessionId}/${user?.email}`)
        }
        setIsLoading(false)
    }
    console.log(cards)

    if (loading) {
        return <div className='flex items-center justify-center w-[88vw]'>
            <Loader2Icon className='animate-spin text-orange-600'/>
        </div>
    }

    return (
        <div>
            <div className='flex items-center justify-between w-full '>

                <Navbar/>
            </div>
            <div>

            </div>
            <div className="h-[60rem] flex flex-col justify-center  items-center px-4">
                <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
                    Позвольте AI сгенерировать план изучения языка
                </h2>
                {/*   <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
            /> */}


                <Button onClick={onStartConsultation}>Начать линго-консультацию</Button>

                <HistoryList/>

            </div>

            <div className='flex items-center justify-center flex-col
            '>
                <h1 className='text-center w-full mb-20 text-2xl'>Выберите язык на котором вы хотите поговорить</h1>
                <FocusCards cards={cards}/>

            </div>
        </div>
    )
}
export default Page

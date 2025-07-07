'use client'
import React, {useEffect, useState, useCallback} from 'react'
import {props} from "@/app/dashboard/language-agent/[sessionId]/[userEmail]/page";
import {useAuth} from "@/context/useAuth";
import axios from "axios";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {languageFlags} from "@/constants";
import moment from "moment/moment";
import {TextHoverEffect} from "@/components/ui/text-hover-effect";
import ViewPracticeDialog from "@/components/ViewPracticeDialog";
import { WavyBackground } from "@/components/ui/wavy-background";
import {Loader2Icon, XCircleIcon} from "lucide-react";
import Navbar from "@/components/Navbar";
import {useRouter} from "next/navigation";
export interface SessionRecord {
    sessionId: string;
    statedLevel: string | null;
    presentLevel?: string;
    selectedLanguage?: {
        language?: string;
    };
    pickedFlag?: string;
    createdOn: string;
    createdBy: string;
    detectedLanguage?: string;
    notes?: string;
    report?: {
        advantages?: string[];
        mistakes?: string[];
        recommendations?: string[];
    };
    conversation?: {
        role: string;
        text: string;
    }[];
}
const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [historyList, setHistoryList] = useState<SessionRecord[]>([])

    const {  loading, user } = useAuth()
    useEffect(() => {
        if (user) {
            getHistoryList()
        }
    }, [user])

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


    const getHistoryList = async () => {
        if (!user) return;

        setIsLoading(true);
        const result = await axios.get(`/api/session-chat?sessionId=all&userEmail=${user?.email}`);
        setHistoryList(result.data);
        setIsLoading(false);
    };
    console.log(historyList)

    const practiceList = historyList.filter((item) =>  item.statedLevel !== null)
    console.log(practiceList)
    return (

        <div className='overflow-x-hidden w-[100%]'>
            <div className='absolute top-0 z-20 w-full'>
                <Navbar/>
            </div>
            <WavyBackground className="max-w-4xl mx-auto pb-40 overflow-x-hidden">


                <p className="text-2xl md:text-3xl lg:text-6xl text-white font-bold inter-var text-center">
                    Ваши практичные <span className='text-orange-500'> AI-диалоги </span>
                </p>
                <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                    Здесь вы можете увидеть все ваши практичные AI-диалоги и всю информацию о них
                    (ошибки, преимущества и рекомендации) </p>
            </WavyBackground>


            <div className='flex items-center flex-col gap-4 justify-center mt-10'>

                <div className='flex items-center justify-center w-[60%]'>
                    <Table>
                        <TableCaption>Предыдущие отчёты консультаций</TableCaption>
                        <TableHeader>
                            <TableRow className='flex items-center justify-between w-full'>
                                <TableHead className='text-center'>Язык</TableHead>
                                <TableHead className='text-center'>Уровень</TableHead>
                                <TableHead className='text-center'>Дата</TableHead>
                                <TableHead className="text-center">Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <div className='flex w-full items-center justify-center'>
                                <div>
                                    <Loader2Icon className='animate-spin text-orange-600'/>
                                </div>
                            </div>}
                            {practiceList.length === 0 && <div className='flex items-center justify-center'>
                                <div className='flex flex-col items-center justify-center'>
                                    <XCircleIcon className='w-[120px] h-[120px] text-orange-600'/>
                                    <h1 className='text-2xl mt-6'>Тут пока ничего нет!</h1>
                                </div>
                            </div>}
                            {practiceList.map((record: SessionRecord, index: number) => (
                                <TableRow key={index} className='flex items-center justify-between w-full'>
                                    <TableCell
                                        className="font-medium flex items-center text-center justify-center gap-3">
                                        <img
                                            src={`https://flagcdn.com/w40/${languageFlags[record?.selectedLanguage?.language || ""] || "un"}.png`}
                                            alt={record?.selectedLanguage?.language}
                                            className="w-5 h-4 object-cover rounded-sm"
                                        />
                                        {record?.pickedFlag || "Н/Д"}</TableCell>
                                    <TableCell className='flex items-center justify-center text-center'>
                                        {record?.statedLevel || "Нет указан"}
                                    </TableCell>
                                    <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>

                                    <ViewPracticeDialog record={record}/>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="h-[40rem] flex items-center justify-center">
                <TextHoverEffect text="Lingvify"/>
            </div>
        </div>
    )
}
export default Page

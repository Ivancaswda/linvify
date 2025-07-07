'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/moving-border";

import { ScrollArea } from "@/components/ui/scroll-area"
import moment from "moment"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useAuth} from "@/context/useAuth";
import Logo_Icon from '@/public/Login_Image.png'

import Image from "next/image";
import {SessionRecord} from "@/app/estimations/page";
type ViewPlanDialogProps = {
    record: SessionRecord
}

const ViewPlanDialog = ({ record }: ViewPlanDialogProps) => {
    const [open, setOpen] = useState(false)
    console.log(record)
    const {user} = useAuth()
    return (


        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>

                    <Button
                        borderRadius="1.50rem"
                        className="dark:bg-orange-600 text-white dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                        Посмотреть план
                    </Button>


            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto darK:bg-white bg-black text-white">
                <DialogHeader>
                    <DialogTitle>Языковой план</DialogTitle>
                    <DialogDescription>
                    Консультация от {moment(record.createdOn).format("DD.MM.YYYY HH:mm")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 ">
                    {/* Общая информация */}
                    <div className="space-y-1">
                        <p className='flex items-center gap-2'><strong>Язык:</strong>
                            <Image width={40} height={30}  src={`https://flagcdn.com/w40/${record?.selectedLanguage?.language ||  "un"}.png`}
                            alt={record?.selectedLanguage?.language}
                            className="w-[40px] h-[30px] object-cover rounded-sm"
                        />
                            {record?.pickedFlag || "Н/Д"}</p>
                        <p><strong>Уровень:</strong> {record.statedLevel}</p>
                        <p><strong>Email:</strong> {record?.createdBy}</p>
                        <p><strong>Заметки:</strong> {record.notes || "—"}</p>
                    </div>


                    <div className="space-y-6 mt-6">

                        {/* Advantages */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-green-700">Сильные стороны</h3>
                            <ul className="space-y-2 list-disc list-inside">
                                {record.report?.advantages?.map((item: string, index: number) => (
                                    <li key={index}
                                        className="bg-green-50 text-black border border-green-200 rounded-md p-2 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mistakes */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-red-700">Ошибки</h3>
                            <ul className="space-y-2 list-disc list-inside">
                                {record.report?.mistakes?.map((item: string, index: number) => (
                                    <li key={index} className="bg-red-50 text-black border border-red-200 rounded-md p-2 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-700">Рекомендации</h3>
                            <ul className="space-y-2 list-disc list-inside">
                                {record.report?.recommendations?.map((item: string, index: number) => (
                                    <li key={index}
                                        className="bg-blue-50 border text-black border-blue-200 rounded-md p-2 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    {/* Разговор */}
                    <div>
                        <h3 className="text-lg font-semibold mt-6 mb-2">История разговора</h3>
                        <ScrollArea className="max-h-64 pr-2">
                            <div className="space-y-3">
                                {record?.conversation?.map((msg, index) => (
                                    <div key={index}
                                         className="p-2 rounded bg-gray-100 dark:bg-gray-800 flex items-start gap-4">
                                        <p className="text-sm text-muted-foreground">
                                            {msg.role === 'user' ? <div>
                                                <Avatar>
                                                    <AvatarImage/>
                                                    <AvatarFallback
                                                        className='bg-orange-600 text-white font-semibold'>{user?.userName.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </div> : <Avatar>
                                                <AvatarImage className='object-cover'
                                                             src={Logo_Icon}/>
                                                <AvatarFallback
                                                    className='bg-violet-600 text-white font-semibold'>A</AvatarFallback>
                                            </Avatar>}
                                        </p>
                                        <p className="whitespace-pre-wrap dark:text-white text-black">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>


    )
}

export default ViewPlanDialog

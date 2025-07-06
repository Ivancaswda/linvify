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
import { Button } from "@/components/ui/button"
import { props } from "@/app/dashboard/language-agent/[sessionId]/[userEmail]/page"
import { ScrollArea } from "@/components/ui/scroll-area"
import moment from "moment"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useAuth} from "@/context/useAuth";

type ViewPlanDialogProps = {
    record: props
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
                    className="  dark:bg-orange-600 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                    Посмотреть план
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-white text-black dark:bg-black dark:text-white max-h-[90vh]  overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Языковой план</DialogTitle>
                    <DialogDescription>
                        Консультация от {moment(record.createdOn).format("DD.MM.YYYY HH:mm")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 bg-white text-black dark:bg-black dark:text-white">
                    {/* Общая информация */}
                    <div className="space-y-1">
                        <p><strong>Язык:</strong> {record.detectedLanguage}</p>
                        <p><strong>Уровень:</strong> {record.presentLevel}</p>
                        <p><strong>Email:</strong> {record?.createdBy}</p>
                        <p><strong>Заметки:</strong> {record.notes || "—"}</p>
                    </div>

                    {/* План на неделю */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">План обучения</h3>
                        <div className="space-y-2">
                            {record.report?.languagePlan?.map((item) => (
                                <div key={item.id} className="p-3 rounded-md bg-muted border">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{item.day}</span>
                                        <Badge variant="secondary">{item.currentLevel}</Badge>
                                    </div>
                                    <p>{item.action}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Разговор */}
                    <div>
                        <h3 className="text-lg font-semibold mt-6 mb-2">История разговора</h3>
                        <ScrollArea className="max-h-64 pr-2">
                            <div className="space-y-3">
                                {record?.conversation?.map((msg, index) => (
                                    <div key={index} className="p-2 rounded bg-gray-100 dark:bg-gray-800 flex items-start gap-4">
                                        <p className="text-sm text-muted-foreground">
                                            {msg.role === 'user' ? <div>
                                                <Avatar>
                                                    <AvatarImage />
                                                    <AvatarFallback className='bg-orange-600 text-white font-semibold'>{user?.userName.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </div> :       <Avatar>
                                                <AvatarImage className='object-cover' src='https://sdmntpritalynorth.oaiusercontent.com/files/00000000-e71c-6246-a7ac-fa8a53361d8c/raw?se=2025-07-05T09%3A55%3A08Z&sp=r&sv=2024-08-04&sr=b&scid=bc3d725c-a5cc-50fc-a14f-c63a477c41bc&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-05T08%3A40%3A50Z&ske=2025-07-06T08%3A40%3A50Z&sks=b&skv=2024-08-04&sig=j2C8P2hk5KlDTQCo6bcQOWOMT2Ly6u1Trg35VEbNyB0%3D' />
                                                <AvatarFallback className='bg-violet-600 text-white font-semibold'>Ai</AvatarFallback>
                                            </Avatar>}
                                        </p>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
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

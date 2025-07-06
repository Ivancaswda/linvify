import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {props} from "@/app/dashboard/language-agent/[sessionId]/[userEmail]/page";
import moment from "moment";
import {Loader2Icon} from "lucide-react";
import ViewPlanDialog from "@/components/ViewPlanDialog";
import {languageFlags} from "@/constants";

type Props = {
    historyList: props[]
}

const HistoryTable = ({historyList}: Props) => {
    console.log(historyList)
    moment.locale('ru');
    if (historyList.length === 0) {
        console.log('список истории пуст')
        return <Loader2Icon className='animate-spin size-4'/>
    }
    console.log(historyList)
    const planList = historyList.filter((item) => item?.detectedLanguage !== null)

    return (
        <Table>
            <TableCaption>Предыдущие отчёты консультаций</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Язык</TableHead>
                    <TableHead>Начальный уровень</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-left">Действие</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {planList.map((record: props, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium flex items-center gap-3">

                            <img
                                src={`https://flagcdn.com/w40/${languageFlags[record?.detectedLanguage || ""] || "un"}.png`}
                                alt={record?.detectedLanguage}
                                className="w-5 h-4 object-cover rounded-sm"
                            />
                            {record?.detectedLanguage || "Н/Д"}</TableCell>
                        <TableCell>
                            {record?.presentLevel || "Нет указан"}
                        </TableCell>
                        <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
                        <ViewPlanDialog record={record}/>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default HistoryTable

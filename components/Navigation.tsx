"use client";
import {TypewriterEffectSmooth} from "@/components/ui/typewriter-effect";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useAuth} from "@/context/useAuth";

function Navigation() {
    const {user} = useAuth()
    const words = [
        {
            text: "Выучи",
        },
        {
            text: "новый",
        },
        {
            text: "язык",
        },
        {
            text: "используя",
        },
        {
            text: "ИИ",
            className: "text-orange-500 dark:text-orange-500",
        },
    ];
    return (
        <div className="flex flex-col items-center justify-center h-[40rem]  ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
               Дорога к свободе начинается здесь
            </p>
            <TypewriterEffectSmooth words={words} />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                <Link href='/dashboard'>
                    <Button  className="w-40 cursor-pointer h-10 rounded-xl  border dark:border-white border-transparent text-white text-sm">
                        Присоединиться
                    </Button>
                </Link>
                {user ?   <Link href="/">
                    <Button variant='ghost' className="w-40 cursor-pointer h-10 rounded-xl bg-white text-black border border-black  text-sm">
                        Связаться с нами
                    </Button>
                </Link>  :   <Link href="/sign-in">
                    <Button variant='ghost' className="w-40 cursor-pointer h-10 rounded-xl bg-white text-black border border-black  text-sm">
                        Создать аккаунт
                    </Button>
                </Link>}


            </div>
        </div>
    );
}
export default Navigation
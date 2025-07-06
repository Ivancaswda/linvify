import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {toast} from "sonner";
import {
    IconBrandGithub,
    IconHome, IconListDetails,
    IconTerminal2,
} from "@tabler/icons-react";
import {ArrowRightToLineIcon} from "lucide-react";
import {useAuth} from "@/context/useAuth";
import {ModeToggle} from "@/components/ModeToggle";
import {useRouter} from "next/navigation";
import Image from "next/image";

import Lingo from '../public/logo-lingvify.png'

 function Navbar() {
     const {logout, user} = useAuth()
     const router = useRouter()

    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },

        {
            title: "Dashboard",
            icon: (
                <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/dashboard",
        },
        {
            title: "PracticeList",
            icon: (
                <IconListDetails className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/estimations",
        },

        {
            title: "Vk",
            icon: (
                <svg width={40} height={40} xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 448 512">
                    <path fill='gray'
                        d="M31.5 63.5C0 95 0 145.7 0 247V265C0 366.3 0 417 31.5 448.5C63 480 113.7 480 215 480H233C334.3 480 385 480 416.5 448.5C448 417 448 366.3 448 265V247C448 145.7 448 95 416.5 63.5C385 32 334.3 32 233 32H215C113.7 32 63 32 31.5 63.5zM75.6 168.3H126.7C128.4 253.8 166.1 290 196 297.4V168.3H244.2V242C273.7 238.8 304.6 205.2 315.1 168.3H363.3C359.3 187.4 351.5 205.6 340.2 221.6C328.9 237.6 314.5 251.1 297.7 261.2C316.4 270.5 332.9 283.6 346.1 299.8C359.4 315.9 369 334.6 374.5 354.7H321.4C316.6 337.3 306.6 321.6 292.9 309.8C279.1 297.9 262.2 290.4 244.2 288.1V354.7H238.4C136.3 354.7 78 284.7 75.6 168.3z"/>
                </svg>
            ),
            href: "#",
        },
        {
            title: "GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300"/>
            ),
            href: "#",
        },
        (user && {
            title: "SignOut",
            icon: (
                <ArrowRightToLineIcon className="h-full w-full text-neutral-500 dark:text-neutral-300"/>
            ),
            href: "#",
            onClick: () => {

                logout();
                router.push("/sign-in");
                toast.success('Вы успешно вышли с аккаунта!')


            }
        })


    ];
     return (
         <div className='flex items-center mx-4'>
             <div className='flex items-center justify-center'>
                 <Image className='w-[120px] h-[100px]  ' width={140} height={90} src={Lingo} alt="logoimage"/>
            </div>
            <div className="flex items-center justify-center h-[60px] mt-4 w-full">
                <FloatingDock
                    mobileClassName="translate-y-20" // only for demo, remove for production
                    items={links.filter(Boolean)}
                />
            </div>

            <ModeToggle/>
        </div>

    );
 }

export default Navbar
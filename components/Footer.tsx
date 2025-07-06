import React from 'react'
import {FacebookIcon, TwitterIcon, YoutubeIcon} from "lucide-react";
import Logo from '@/public/logo-lingvify.png'
import Image from "next/image";
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">


                    <div>
                        <Image width={80} height={60} src={Logo} alt="LOGO"/>

                        <p className="text-sm text-gray-400">
                            Улучши свой английский с помощью ИИ. Персональные рекомендации, разговорные сессии и точный
                            анализ.
                        </p>
                    </div>


                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Навигация</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/dashboard" className="hover:underline">Главная</a></li>
                            <li><a href="/sessions" className="hover:underline">Сессии</a></li>
                            <li><a href="/profile" className="hover:underline">Профиль</a></li>
                            <li><a href="/pricing" className="hover:underline">Тарифы</a></li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Ресурсы</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/faq" className="hover:underline">FAQ</a></li>
                            <li><a href="/blog" className="hover:underline">Блог</a></li>
                            <li><a href="/contact" className="hover:underline">Контакты</a></li>
                            <li><a href="/terms" className="hover:underline">Политика и условия</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Мы в соцсетях</h3>
                        <div className="flex space-x-4">
                            <a href="https://t.me/linvify" target="_blank" className="hover:text-white">
                                <FacebookIcon/>
                            </a>
                            <a href="https://www.instagram.com/linvify" target="_blank" className="hover:text-white">
                                <TwitterIcon/>
                            </a>
                            <a href="https://www.linkedin.com/company/linvify" target="_blank"
                               className="hover:text-white">
                                <YoutubeIcon/>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-center text-gray-500">
                    © {new Date().getFullYear()} Lingvify. Все права защищены.
                </div>
            </div>
        </footer>
    )
}
export default Footer

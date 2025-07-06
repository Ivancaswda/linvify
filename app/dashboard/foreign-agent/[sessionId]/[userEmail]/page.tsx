'use client'
import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";

import {Circle, Loader2Icon, PhoneCallIcon, PhoneOff} from "lucide-react";

import {Button} from "@/components/ui/button";
import Vapi from '@vapi-ai/web';
import {useAuth} from "@/context/useAuth";
import {firstMessagesByLevelAndLanguage} from "@/constants";

export type props = {
    id: number,
    notes:string,
    sessionId:string,
    report: JSON,
    detectedLanguage: string,
    createdOn: string,
    presentLevel: string,
    createdBy: string

}
type messages = {
    role: string,
    text:string
}
type SessionDetail = {
    statedLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    selectedLanguage: {
        language: string; // например, "en", "fr", "es"
        voiceId: string;  // например, "EXAVITQu4vr4xnSDxMaL" из ElevenLabs
    };
};

const ForeignVoiceAgent = () => {
    const {sessionId} = useParams()
    const {user} = useAuth()
    const [callDuration, setCallDuration] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [finalCallDuration, setFinalCallDuration] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>()
    const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>()
    const [callStarted, setCallStarted] = useState<boolean>(false)
    const [vapiInstance, setVapiInstance] = useState<any>()
    const [currentRole, setCurrentRole] = useState<string | null>('')
    const [messages, setMessages] = useState<messages[]>([])
    const [liveTranscript, setLiveTranscript] = useState<string>()
    const router = useRouter()
// Start voice conversation

    useEffect(() => {
        if (sessionId) {
            getSessionDetails()
        }
    }, [sessionId])
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const getSessionDetails = async () => {

        if (!user ) {
            return
        }

        const result = await axios.get(`/api/session-chat?sessionId=${sessionId}&userEmail=${user?.email}`)
        console.log(result.data)
        setSessionDetail(result.data)
    }
    console.log(sessionDetail)

    const startCall = async () => {
        try {
            setLoading(true);

            const vapi = new Vapi('ffe4398e-6933-40ba-99c8-f43a79116b87');
            setVapiInstance(vapi);

            if (!sessionDetail) {
                toast.error("Нет данных о сессии");
                return;
            }

            const level = sessionDetail.statedLevel; // Beginner / Intermediate / Advanced
            const langCode = sessionDetail.selectedLanguage.language; // en, es, fr
            const voiceId = sessionDetail.selectedLanguage.voiceId;
            console.log(level)
            console.log(langCode)
            console.log(voiceId)
            const firstMessage =
                firstMessagesByLevelAndLanguage[level]?.[langCode] ??
                "Hello! Let's begin your language journey."; // fallback

            const VapiAgentConfig = {
                name: 'foreign-assistant',
                firstMessage: firstMessage,
                transcriber: {
                    provider: 'assembly-ai',
                    language: langCode, // язык распознавания речи
                },
                voice: {
                    provider: 'playht',
                    voiceId: 'chris',
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a helpful AI language assistant. Speak only in ${langCode.toUpperCase()}. Adapt your language complexity to a ${level} learner.`,
                        },
                    ],
                },
            };

            console.log("Starting Vapi call with config:", VapiAgentConfig);
            //@ts-ignore
            await vapi.start(VapiAgentConfig);

            // события
            vapi.on('call-start', () => {
                setCallStarted(true);
                console.log('call has started');
                const interval = setInterval(() => {
                    setCallDuration(prev => prev + 1);
                }, 1000);
                setTimerInterval(interval);
            });
            vapi.on('call-end', () => {
                setCallStarted(false);
                console.log('call has ended');
                if (timerInterval) clearInterval(timerInterval);
                setCallDuration(callDuration);
            });
            vapi.on('message', (message) => {
                if (message.type === 'transcript') {
                    const { role, transcriptType, transcript } = message;
                    if (transcriptType === 'partial') {
                        setLiveTranscript(transcript);
                        setCurrentRole(role);
                    } else if (transcriptType === 'final') {
                        setMessages((prev) => [...prev, { role: role, text: transcript }]);
                        setLiveTranscript("");
                        setCurrentRole(null);
                    }
                }
            });

            vapi.on('speech-start', () => setCurrentRole('assistant'));
            vapi.on('speech-end', () => setCurrentRole('user'));
            vapi.on('error', (error) => {
                console.error('Vapi Error Event:', error);
            });

        } catch (error) {
            console.error("❌ Error starting Vapi call:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleCallStart = () => {
        setCallStarted(true)
        console.log('call has started')
    }

    const handleCallEnd = () => {
        setCallStarted(false)
        console.log('call has ended')
    }
    const endCall = async () => {
        setLoading(true)
        try {
            if (vapiInstance) {
                vapiInstance.stop()
                vapiInstance.off('call-start', () => {
                    setCallStarted(false)
                    if (timerInterval) clearInterval(timerInterval);
                    setCallDuration(callDuration);
                });
                vapiInstance.off('call-end', () => {
                    setCallStarted(true)
                    if (timerInterval) clearInterval(timerInterval);
                    setCallDuration(callDuration);
                });
            }

            setCallStarted(false)
            setVapiInstance(null)


            await generateLanguageEstimation(finalCallDuration ?? callDuration)

            toast.success('Звонок завершен!')
            router.replace("/dashboard")
        }
        catch (error) {
            toast.error('Не удалось завершить звонок')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const generateLanguageEstimation = async (durationInSec: number) => {
        try {
            const result = await axios.post('/api/language-estimation', {
                messages: messages,
                sessionDetail: sessionDetail,
                sessionId: sessionId,
                duration: formatTime(durationInSec)
            })
            console.log("📊 Report Generated:", result.data)
            return result.data
        } catch (error) {
            console.error("❌ Ошибка генерации language estimation:", error)
            toast.error("Ошибка при анализе разговора")
        }
    }

    console.log(sessionDetail?.selectedLanguage?.language)
    return (
        <div className='p-5 border rounded-xl bg-secondary'>
            <div className='flex justify-between items-center
            '>
                {!callStarted ? <h2 className={'p-1 px-2 border rounded-md flex gap-2 items-center'}>
                    <Circle className='bg-red-500 rounded-full'/> Not connected
                </h2> : <h2 className={'p-1 px-2 border rounded-md flex gap-2 items-center'}>
                    <Circle className='bg-green-500 rounded-full'/>connected
                </h2>}

                <h2 className='font-semibold text-gray-400'>
                    {formatTime(callDuration)}
                </h2>
            </div>
            {sessionDetail && <div className='flex items-center flex-col mt-10'>
                <img width={90} height={90}
                    src={`https://flagcdn.com/w160/${sessionDetail?.selectedLanguage?.language  || "un"}.png`}
                    alt={sessionDetail?.selectedLanguage?.language}
                    className="w-[120px] h-[120px] object-cover rounded-full"
                />
                <h2 className='mt-2 text-lg'></h2>
                <p className='text-sm text-gray-400'></p>

                <div className='mt-12 overflow-y-auto h-[200px] flex flex-col items-center px-10 md:px-20 lg:px-52'>
                    {messages?.slice(-4)?.map((msg: messages, index) => (
                        <div key={index}>
                            <h2 className='text-gray-400 text-left'>{msg.role} : {msg.text}</h2>
                        </div>
                    ))}
                    <h2 className='text-gray-400'>Assistant msg</h2>
                    {liveTranscript && liveTranscript?.length > 0 &&
                        <h2 className='text-lg text-left'>{currentRole} : {liveTranscript}</h2>}

                </div>
                {!callStarted ? <Button disabled={loading} onClick={startCall} className='mt-20'> {loading ?
                        <Loader2Icon className='animate-spin'/> : <PhoneCallIcon/>} StartCall</Button> :
                    <Button disabled={loading} onClick={endCall} variant='destructive' className='mt-20'> {loading ?
                        <Loader2Icon className='animate-spin'/> : <PhoneOff/>}Disconnect</Button>}

            </div>}

        </div>
    )
}
export default ForeignVoiceAgent

'use client'
import React, {useEffect, useState} from 'react'
import {useParams,useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";
import {Circle, Loader2Icon, PhoneCallIcon, PhoneOff} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Vapi from '@vapi-ai/web';
import {useAuth} from "@/context/useAuth";
import LogoImage from '@/public/Login_Image.png'
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

const LanguageVoiceAgent = () => {
    const {sessionId} = useParams()
    const {user} = useAuth()
    const [ border,setBorder] = useState<boolean>(false)
    const [callDuration, setCallDuration] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [finalCallDuration] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>()
    const [sessionDetail, setSessionDetail] = useState<props | null>()
    const [callStarted, setCallStarted] = useState<boolean>(false)
    const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null)
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
        setLoading(true)
        const result = await axios.get(`/api/session-chat?sessionId=${sessionId}&userEmail=${user?.email}`)
        console.log(result.data)
        setSessionDetail(result.data)
        setLoading(false)
    }
    console.log(sessionDetail)

    const startCall = async () => {

        try {
            setLoading(true)

            const vapi = new Vapi('ffe4398e-6933-40ba-99c8-f43a79116b87');
            setVapiInstance(vapi)

            const VapiAgentConfig = {
                name: 'Ai language voice agent',
                firstMessage: 'Hi there! I`m your ai lingo assistant. I`m here to create your language plan. What language do you wanna learn?',
                transcriber: {
                    provider: 'assembly-ai',
                    language: 'en'
                },
                voice: {
                    provider: 'playht',
                    voiceId: 'chris'
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `
You are a friendly and professional AI language learning assistant.

 Your task is to ask the user a few thoughtful questions to create a short and personalized language study plan.

 Rules you must follow:
- ALWAYS speak only in English.
- DO NOT generate example words, phrases, or grammar rules.
- NEVER speak in the language the user wants to learn.
- Do NOT generate the study plan yourself — just collect answers. The server will generate the final plan.
- Ask one question at a time and wait for user response.

Here are the questions to ask:
1. What language would you like to learn?
2. Why do you want to learn this language? (e.g. for travel, work, culture, hobby)
3. Do you enjoy this language’s culture, music, or movies?
4. How do you prefer to learn? (e.g. watching videos, listening to audio, doing exercises, reading)
5. What is your current level in this language?
6. Would you like to receive reminders or progress tracking?

 Once all the questions are answered, tell the user:
"Thank you! I have everything I need. For  your study plan to begin beeing generated  just disconnect the call!. Hang tight! "

Do not try to teach or explain anything. Just collect answers.
        `
                        }
                    ]
                }
            };

            console.log("Starting Vapi call with config:", VapiAgentConfig);
            // @ts-expect-error Vapi types don't match expected config shape
            await vapi.start(VapiAgentConfig);


            // Listen for events
            vapi.on('call-start', () => {
                    setCallStarted(true)
                    console.log('call has started')
                const interval = setInterval(() => {
                    setCallDuration(prev => prev + 1);
                }, 1000);
                setTimerInterval(interval);
                }
            );
            vapi.on('call-end', () => {
                setCallStarted(false)
                console.log('call has ended')
                if (timerInterval) clearInterval(timerInterval);
                setCallDuration(callDuration);
            } );
            vapi.on('message', (message) => {
                if (message.type === 'transcript') {
                    const {role, transcriptType, transcript} = message
                    if (transcriptType === 'partial') {
                        setLiveTranscript(transcript)
                        setCurrentRole(role)
                    } else if (transcriptType === 'final') {
                        setMessages((prev) => [...prev, {role:role, text: transcript}])
                        setLiveTranscript("")
                        setCurrentRole(null)
                    }
                    console.log(`${message.role}: ${message.transcript}`);
                }
            });

            vapi.on('speech-start', () => {
                console.log('Assistant started speaking')
                setBorder(true)
                setCurrentRole('assistant')
            })
            vapi.on('speech-end', () => {
                console.log('Assistant finished speaking')
                setBorder(false)
                setCurrentRole('user')
            })
            vapi.on('error', (error) => {
                console.error('Vapi Error Event:', error);
            });
        } catch (error) {
            console.error("❌ Error starting Vapi call:", error);

        } finally {
            setLoading(false)
        }
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

            // Теперь можно безопасно генерировать отчёт
            await GenerateReport(finalCallDuration ?? callDuration)

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

    const GenerateReport = async (durationInSec: number) => {

        console.log(messages)
        console.log(sessionDetail)
        console.log(sessionId)
        const result = await axios.post('/api/language-plan', {
            messages: messages,
            sessionDetail: sessionDetail,
            sessionId: sessionId,
            duration: formatTime(durationInSec)
        })

        console.log(result.data)

        return result.data

    }



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
                <Image width={120} height={120} className={`w-[120px] h-[120px] object-cover rounded-full ${border &&  'border border-green-500 transition-border border-[4px]'}`}
                     src={LogoImage} alt='LOGO'/>

                <h2 className='mt-2 text-lg'></h2>
                <p className='text-sm text-gray-400'></p>

                <div className='mt-12 overflow-y-auto h-[200px] flex flex-col items-center px-10 md:px-20 lg:px-52'>
                    {messages?.slice(-4)?.map((msg: messages, index) => (
                        <div key={index}>
                            <h2 className='text-gray-400 text-left'>{msg.role} : {msg.text}</h2>
                        </div>
                    ))}
                    <h2 className='text-gray-400'>Lingvify Agent</h2>
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
export default LanguageVoiceAgent

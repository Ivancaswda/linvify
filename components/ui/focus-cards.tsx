"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {useAuth} from "@/context/useAuth";
import {useRouter} from "next/navigation";
import {Loader2Icon} from "lucide-react";

export const Card = React.memo(
    ({
         card,
         index,
         hovered,
         setHovered,
         onClick,
     }: {
        card: CardType;
        index: number;
        hovered: number | null;
        setHovered: React.Dispatch<React.SetStateAction<number | null>>;
        onClick: () => void;
    }) => {

        return (
            <div
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={onClick}
                className={cn(
                    "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-[190px] w-[300px] transition-all duration-300 ease-out cursor-pointer",
                    hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
                )}
            >
                <img
                    src={card.src}
                    alt={card.title}
                    className="object-cover w-[100%] h-[100%] object-cover absolute inset-0"
                />
                <div
                    className={cn(
                        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
                        hovered === index ? "opacity-100" : "opacity-0"
                    )}
                >
                    <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                        {card.title}
                    </div>
                </div>
            </div>
        )
    }

);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
};

type CardType = {
  title: string;
  src: string
  selectedLanguage: string;
  voiceId: string;
};
export function FocusCards({
                               cards,
                           }: {
    cards: CardType[];
}) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
    const [showLevelModal, setShowLevelModal] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCardClick = (card: CardType) => {
        setSelectedCard(card);
        setShowLevelModal(true);
    };

    const onStartLanguageConsultation = async (card: CardType, level: string) => {
        setIsLoading(true);

        if (!user) return;

        const result = await axios.post("/api/session-chat", {
            notes: `Практичный диалог`,
            user,
            pickedFlag: card.title,
            statedLevel: level,
            selectedLanguage: {
                language: card.selectedLanguage,
                voiceId: card.voiceId,
            },
        });

        if (result?.data?.sessionId) {
            router.push(`/dashboard/foreign-agent/${result.data.sessionId}/${user?.email}`);
        }

        setIsLoading(false);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
                {cards.map((card, index) => (
                    <Card
                        key={card.title}
                        card={card}
                        index={index}
                        hovered={hovered}
                        setHovered={setHovered}
                        onClick={() => handleCardClick(card)}
                    />
                ))}
            </div>

            {showLevelModal && selectedCard && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-[90%] max-w-md">
                        <h2 className="text-xl mb-4 text-center">
                            Выберите уровень языка для: <strong>{selectedCard.title}</strong>
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                <button
                                    key={level}
                                    className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
                                    onClick={() => {
                                        onStartLanguageConsultation(selectedCard, level);
                                        setShowLevelModal(false);
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <button
                            className="mt-6 text-sm text-gray-500 underline"
                            onClick={() => setShowLevelModal(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {isLoading && <div className='flex items-center justify-center h-[100vh] w-full'>
                <Loader2Icon className='animate-spin text-orange-600'/>
            </div>}
        </div>
    );
}


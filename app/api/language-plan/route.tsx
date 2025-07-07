import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import {SessionChatTable} from "@/config/schema";
import db from "@/config/db";
import {eq} from "drizzle-orm";
type Message = { role: string; text: string };
export async function POST(req: NextRequest) {
    try {
        const { messages, duration, sessionId } = await req.json();

        const transcriptText = messages.map((msg: Message) => `${msg.role}: ${msg.text}`).join('\n');




        const numberOfDays = 7; // по умолчанию

        const prompt = `
Based on the following conversation between the user and the AI assistant:

${transcriptText}

Create a short but personalized daily language study plan. The plan must include **exactly ${numberOfDays} days**. Do not include examples of words, phrases, or grammar. Just list the actions for each day, such as: "Listen to an audio lesson", "Review vocabulary", "Do exercises".

The response must be strictly in JSON format:
{
  "languagePlan": [
    {
      "id": 1,
      "language": "Spanish",
      "day": "Monday",
      "action": "Listen to an audio lesson and review the material.",
      "currentLevel": "A1"
    },
    ...
  ]
}
`;


        const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            messages: [
                { role: 'system', content:  'You are a helpful language learning assistant. Always respond strictly in JSON format as specified.' },
                { role: 'user', content: prompt }
            ]
        });
        const rawResp = completion.choices[0].message

        const raw = rawResp.content?.trim() || "";
        const jsonMatch = raw.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error('❌ JSON не найден в ответе:', raw);
            throw new Error("Ответ не содержит JSON");
        }

        let JSONResp;
        try {
            JSONResp = JSON.parse(jsonMatch[0]);
        } catch  {
            console.error('❌ Ошибка парсинга JSON:', jsonMatch[0]);
            throw new Error("Невалидный JSON от OpenAI");
        }
        console.log(JSONResp)
        const detectedLanguage = JSONResp.languagePlan?.[0]?.language || 'Язык не указан';

        const presentLevel = JSONResp.languagePlan?.[0]?.currentLevel || 'Не указан'
        await db.update(SessionChatTable).set({
            report: JSONResp,
            conversation: messages,
            callDuration: duration,
            detectedLanguage: detectedLanguage,
            presentLevel: presentLevel
        }).where(eq(SessionChatTable.sessionId, sessionId))
        return NextResponse.json(JSONResp);
    } catch (error) {
        console.error('Ошибка генерации плана:', error);
        return NextResponse.json({ error: 'Ошибка при генерации плана' }, { status: 500 });
    }
}

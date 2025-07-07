import {NextRequest, NextResponse} from "next/server";
import {openai} from "@/config/OpenAiModel";
import {eq} from "drizzle-orm";
import db from "@/config/db";
import {SessionChatTable} from "@/config/schema";


const ESTIMATION_PROMPT = `
You are an expert language evaluator AI. Analyze the user's language skills from the following conversation.
You must output a JSON object like this:

{
  "level": "Beginner" | "Intermediate" | "Advanced" | "Fluent",
  "mistakes": ["mistake1", "mistake2"],
  "advantages": ["adv1", "adv2"],
  "recommendations": ["rec1", "rec2"]
}

Only respond with a valid JSON. No markdown, no explanations.
`;
export async function POST(req: NextRequest) {
    const {sessionId, sessionDetail, messages, duration} = await req.json()

    try {
        const UserInput = `Session Info: ${JSON.stringify(sessionDetail)} \n\n Conversation:\n ${JSON.stringify(messages)}`;

        const completion = await openai.chat.completions.create({
            model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            messages: [
                {role: 'system', content: ESTIMATION_PROMPT},
                {role: 'user', content: UserInput}
            ]
        })
        const rawResp = completion.choices[0].message

        const Resp = (rawResp.content ?? '').trim().replace('```json', '').replace('```', '');
        const JSONResp = JSON.parse(Resp)

        await db.update(SessionChatTable).set({
            report: JSONResp,
            conversation: messages,
            callDuration: duration
        }).where(eq(SessionChatTable.sessionId, sessionId))
        return NextResponse.json(JSONResp)
    } catch (error) {
        return NextResponse.json(error)
    }
}
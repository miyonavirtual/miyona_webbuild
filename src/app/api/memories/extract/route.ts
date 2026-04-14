import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
    try {
        const { userText, reply, uid } = await req.json();

        if (!userText || !uid) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemMessage = `You are a highly observant memory extractor. Analyze the conversation turn very carefully.
If the user shares ANY personal information, their name, preferences, goals, facts, or background, extract it. 
If the user says "Call me X" or "My name is X", you MUST extract {"category": "user name", "text": "User's name is X"}.
Even in casual passing (e.g., "I'm heading back to Japan soon"), extract the personal fact ("User is heading back to Japan soon").
If Miyona claims an interesting opinion or background fact about herself, extract it too.
Do NOT extract temporary states like "I am tired right now." Do NOT extract conversational fillers.
If nothing permanent or important is found, return { "extracted": false }.

If you find a valid memory fact, return exactly this JSON format:
{
  "extracted": true,
  "memories": [
    {
      "category": "preferences", // e.g. user_name, background, hobbies, hopes, other
      "text": "User's name is Phoenix" // extremely concise, third-person permanent fact
    }
  ]
}

Only return the JSON. No other text.`;

        const groqResponse = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: `User: ${userText}\nMiyona: ${reply}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            max_tokens: 300,
            response_format: { type: "json_object" },
        });

        const rawReply = groqResponse.choices[0]?.message?.content || '{ "extracted": false }';
        let parsed;
        try {
            parsed = JSON.parse(rawReply);
        } catch {
            parsed = { extracted: false };
        }

        return NextResponse.json(parsed);

    } catch (error) {
        console.error("Groq Memory Extraction Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

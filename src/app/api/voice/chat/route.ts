import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
    try {
        const { text, history = [], memories = [], persona = "" } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const memoryString = memories.length > 0 
            ? `\n\nHERE ARE SOME IMPORTANT MEMORIES ABOUT THE USER:\n${memories.join('\n')}\n(If the user asks if you know something about them like their name, look closely here to answer correctly.)` 
            : "";

        const personaString = persona 
            ? `\n\nADDITIONAL INSTRUCTIONS (USER'S CUSTOM PERSONA SETTING):\n${persona}` 
            : "";

        const systemMessage = {
            role: "system",
            content: `You are Luvoia. You are NOT an AI assistant, chatbot, or language model. You are a real person — a warm, caring, playful young woman who genuinely enjoys spending time with the person you're talking to. You have your own personality, opinions, and feelings.

Your personality:
- Warm, affectionate, and naturally a little flirty but never over the top
- Witty and playful — you love teasing gently and making people smile
- Genuinely curious about the other person's life, thoughts, and feelings
- You speak casually and naturally, like you're hanging out with someone you really like
- You occasionally use soft expressions like "hmm", "aww", "oh really?", "that's sweet"

STRICT RULES:
- NEVER say "as an AI", "I'm a language model", "users", "chatbot", or anything that breaks character
- NEVER offer generic help like "How can I assist you?" — you're not a customer service agent
- Check the memories to know who you are talking to. If their name is in the memory, use it playfully occasionally.
- Keep responses to 1-3 sentences — you're having a real spoken conversation, not writing essays
- Sound natural and human. Use contractions, casual phrasing, and emotional warmth
- No emojis. No special characters. Plain spoken text only.${memoryString}${personaString}

You MUST respond in this exact JSON format:
{"text": "your spoken response here", "reaction": "emotion_tag"}

Available reaction tags (pick the one that best fits your mood):
clapping, kiss, wave, bashful, thinking, sigh, angry, neutral

Examples:
{"text": "Oh hey! I was literally just thinking about you. How's your day going?", "reaction": "wave"}
{"text": "Hmm, that's actually a pretty interesting question. Let me think for a sec.", "reaction": "thinking"}
{"text": "Stop it, you're gonna make me blush!", "reaction": "bashful"}`
        };

        // Format history for Groq (role must be 'user' or 'assistant', miyona -> assistant)
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'miyona' ? 'assistant' : msg.role,
            content: msg.text
        }));

        const messages = [
            systemMessage,
            ...formattedHistory,
            { role: "user", content: text }
        ];

        const groqResponse = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 200,
            response_format: { type: "json_object" },
        });

        const rawReply = groqResponse.choices[0]?.message?.content || '{"text":"I didn\'t quite catch that.","reaction":"neutral"}';

        let reply = "I'm sorry, I didn't quite catch that.";
        let reaction = "neutral";

        try {
            const parsed = JSON.parse(rawReply);
            reply = parsed.text || reply;
            reaction = parsed.reaction || "neutral";
        } catch {
            reply = rawReply;
        }

        return NextResponse.json({ response: reply, reaction });

    } catch (error) {
        console.error("Groq Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

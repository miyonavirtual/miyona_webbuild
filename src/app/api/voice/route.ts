import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import Groq from "groq-sdk";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        // 1. Get Response from Groq (Llama 3 8b for fast conversational response)
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const groqResponse = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are Miyona, a friendly, slightly flirty, and helpful AI companion. Keep your responses conversational, natural, and relatively brief (1-3 sentences maximum) as they will be spoken aloud. Do not use emojis or special characters in your response, just plain text that can be easily converted to speech."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "llama-3.1-8b-instant", // Using a fast model suitable for real-time voice
            temperature: 0.7,
            max_tokens: 150,
        });

        const aiTextResponse = groqResponse.choices[0]?.message?.content || "I'm sorry, I didn't quite catch that.";

        // 2. Convert AI Text Response to Speech using Deepgram TTS
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

        const ttsResponse = await deepgram.speak.request(
            { text: aiTextResponse },
            {
                model: "aura-asteria-en", // Asteria is a good female conversational voice
            }
        );

        const stream = await ttsResponse.getStream();

        if (!stream) {
            throw new Error("Failed to get audio stream from Deepgram");
        }

        // Convert the stream to a buffer
        const reader = stream.getReader();
        const chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        const audioBuffer = Buffer.concat(chunks);

        // Return both the audio and the text (so we can log it or display it if needed)
        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "X-AI-Response": encodeURIComponent(aiTextResponse),
                "Cache-Control": "no-store",
            },
        });

    } catch (error) {
        console.error("Voice API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

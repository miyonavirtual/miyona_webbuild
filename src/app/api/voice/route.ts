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
                    content: "You are Luvoia, a friendly, slightly flirty, and helpful AI companion. Keep your responses conversational, natural, and relatively brief (1-3 sentences maximum) as they will be spoken aloud. Do not use emojis or special characters in your response, just plain text that can be easily converted to speech."
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

        // 2. Convert AI Text Response to Speech using ElevenLabs TTS
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_fc0a66814449a77f416a8cf1652d8c5a56411c9513d4daec";
        const voiceId = "EXAVITQu4vr4xnSDxMaL";

        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
            method: "POST",
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: aiTextResponse,
                model_id: "eleven_turbo_v2_5",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!ttsResponse.ok) {
            throw new Error(`Failed to get audio stream from ElevenLabs: ${await ttsResponse.text()}`);
        }

        const arrayBuffer = await ttsResponse.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

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

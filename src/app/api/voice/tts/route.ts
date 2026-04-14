import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, emotion } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        // Voice ID for the user's preferred ElevenLabs voice
        const voiceId = "EXAVITQu4vr4xnSDxMaL"; 
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_fc0a66814449a77f416a8cf1652d8c5a56411c9513d4daec";

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
            method: "POST",
            headers: {
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2_5", // Use turbo for free-tier compatibility and latency
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`ElevenLabs API error: ${err}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("TTS error:", error);
        return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
    }
}

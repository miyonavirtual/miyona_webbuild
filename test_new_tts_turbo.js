async function run() {
    const text = "Checking the new API key with turbo model";
    const voiceId = "EXAVITQu4vr4xnSDxMaL";
    const ELEVENLABS_API_KEY = "sk_fc0a66814449a77f416a8cf1652d8c5a56411c9513d4daec";
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_turbo_v2_5",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
            }
        }),
    });
    if (!response.ok) {
        console.error(await response.text());
    } else {
        console.log("Success with new key and turbo model! Received MP3 buffer.");
    }
}
run();

async function run() {
    const text = "Checking backend connection";
    const voiceId = "EXAVITQu4vr4xnSDxMaL";
    const ELEVENLABS_API_KEY = "sk_c5730c7d5cccc9ef410cb2b5bf94273bba7101b4ca0a1684";
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
            }
        }),
    });
    if (!response.ok) {
        console.error(await response.text());
    } else {
        console.log("Success");
    }
}
run();

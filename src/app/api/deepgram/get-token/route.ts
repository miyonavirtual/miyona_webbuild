import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

export async function GET() {
    try {
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

        let projectId = process.env.DEEPGRAM_PROJECT_ID;

        // Dynamically fetch project ID if not explicitly set
        if (!projectId) {
            const { result: projectResult, error: projectError } = await deepgram.manage.getProjects();
            if (projectError || !projectResult || projectResult.projects.length === 0) {
                console.error("Failed to find Deepgram project", projectError);
                return NextResponse.json({ error: "Could not find Deepgram project" }, { status: 500 });
            }
            projectId = projectResult.projects[0].project_id;
        }

        // We generate a temp key that expires soon to give to the browser client securely
        const { result, error } = await deepgram.manage.createProjectKey(
            projectId,
            {
                comment: "temp_browser_key",
                scopes: ["usage:write"],
                expiration_date: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour
            }
        );

        if (error || !result) {
            // Fallback or explicit warning if project ID is missing
            return NextResponse.json({ error: "Could not create token. Ensure DEEPGRAM_PROJECT_ID is set in .env" }, { status: 500 });
        }

        return NextResponse.json({ key: result.key });
    } catch (error) {
        console.error("Deepgram Token Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

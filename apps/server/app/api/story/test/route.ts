import { generateStoryText } from "@/integrations/ai/anthropic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const prompt =
    typeof body?.prompt === "string"
      ? body.prompt
      : "请生成一段 100 字以内的古风悬疑开场。";

  try {
    const result = await generateStoryText({
      system: "你是《无限梦境》的剧情生成器。请输出简洁、具体、具画面感的古风小说文本。",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 160
    });

    return Response.json({
      ok: true,
      ...result
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}

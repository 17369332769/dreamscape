type StoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type GenerateStoryInput = {
  system: string;
  messages: StoryMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

type AnthropicTextBlock = {
  type: "text";
  text: string;
};

type AnthropicResponse = {
  id?: string;
  model?: string;
  content?: AnthropicTextBlock[];
  stop_reason?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

function readConfig() {
  const baseUrl = process.env.ANTHROPIC_BASE_URL ?? "https://claude.aiapis.help";
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    apiKey,
    model
  };
}

export async function generateStoryText(input: GenerateStoryInput) {
  const config = readConfig();
  const response = await fetch(`${config.baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: input.model ?? config.model,
      max_tokens: input.maxTokens ?? 256,
      temperature: input.temperature ?? 0.7,
      system: input.system,
      messages: input.messages
    })
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${rawText}`);
  }

  const data = JSON.parse(rawText) as AnthropicResponse;
  const text = data.content
    ?.filter((block): block is AnthropicTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    throw new Error("Anthropic response missing text content");
  }

  return {
    text,
    model: data.model ?? input.model ?? config.model,
    raw: data,
    usage: data.usage ?? null
  };
}

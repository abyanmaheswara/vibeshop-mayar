export const parseAIOutput = (text) => {
  try {
    // Basic regex or JSON parsing logic for AI output
    // Assuming AI returns a clean JSON block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (e) {
    console.error("Failed to parse AI output", e);
    return null;
  }
};

export const generateStore = async (prompt, theme = "Bold") => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, theme }),
    });

    if (!response.ok) {
      throw new Error(`AI generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI Generation failed, falling back to mock:", error);
    // Fallback if needed or just rethrow
    throw error;
  }
};

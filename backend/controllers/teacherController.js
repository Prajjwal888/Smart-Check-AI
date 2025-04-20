import { Client } from "@gradio/client";
const generateQuestions = async (req, res) => {
  const { topic, difficulty, questionTypes, numQuestions } = req.body;
  console.log("Request Body:", req.body);
  const client = await Client.connect("https://7b90b4ce705f89c3e0.gradio.live/");
  try {
    const result = await client.predict("/predict", {
      topic,
      difficulty,
      types: questionTypes,
      count: numQuestions,
    });
    const markdownString =
      typeof result?.data === "string"
        ? result.data
        : Array.isArray(result?.data) && typeof result.data[0] === "string"
        ? result.data[0]
        : "";

    if (!markdownString) {
      return res
        .status(500)
        .json({ error: "Invalid response format from AI model." });
    }

    const questions = markdownString
      .split("---")
      .map((q) => {
        const typeMatch = q.match(/\*\*Type\*\*:\s*(.*)/);
        const questionMatch = q.match(/\*\*Question\*\*:\s*(.*)/s);
        const hintMatch = q.match(/\*\*Hint\*\*:\s*(.*)/s);

        if (typeMatch && questionMatch && hintMatch) {
          return {
            type: typeMatch[1].trim(),
            text: questionMatch[1].split("\n")[0].trim(),
            hint: hintMatch[1].split("\n")[0].trim(),
          };
        }
        return null;
      })
      .filter((q) => q !== null);

    // console.log("Parsed Questions:", questions);
    res.json(questions);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions." });
  }
};
export {generateQuestions};
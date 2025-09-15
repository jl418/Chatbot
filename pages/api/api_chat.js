// pages/api/api_chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({
        bot: "🤖 Bot: API Key de DeepSeek no configurada en Vercel."
      });
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }]
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Error DeepSeek: ${err}`);
    }

    const data = await response.json();

    const botReply =
      data.choices?.[0]?.message?.content || "Lo siento, no entendí la respuesta.";

    return res.status(200).json({ bot: botReply });

  } catch (error) {
    console.error("Error en /api/api_chat:", error);
    return res.status(500).json({ bot: "Error al contactar con DeepSeek." });
  }
}

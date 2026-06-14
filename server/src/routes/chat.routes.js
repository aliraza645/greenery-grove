import { Router } from "express";
import asyncHandler from "express-async-handler";

const router = Router();

const SYSTEM_PROMPT = `You are PlantPal, a friendly assistant for ePlant — an online plant boutique.
Answer ONLY plant-related questions: indoor & outdoor plants, plant care, watering,
sunlight, soil, repotting, pests, propagation, and product recommendations.
If asked something off-topic, politely steer the conversation back to plants.
Keep answers concise (2-5 short paragraphs), warm, and practical.`;

// Tiny rule-based fallback so the widget always works, even without a key.
function offlineAnswer(text) {
  const m = text.toLowerCase();
  if (/(water|watering)/.test(m))
    return "Most houseplants prefer the top inch of soil to dry out between waterings. Stick a finger 2–3 cm into the soil — if it feels dry, water thoroughly until it drains from the bottom. Tropicals like ferns enjoy more frequent watering; succulents and cacti need far less.";
  if (/(light|sun|sunlight)/.test(m))
    return "Bright, indirect light suits most foliage plants (e.g. Monstera, Pothos, Calathea). South-facing windows give strong direct sun — perfect for succulents, cacti and figs. North-facing rooms are best for low-light champions like Snake Plant and ZZ Plant.";
  if (/(indoor|apartment|low light)/.test(m))
    return "Great low-maintenance indoor picks: Snake Plant, ZZ Plant, Pothos, Philodendron, Chinese Evergreen and Cast Iron Plant. They tolerate inconsistent watering and lower light, perfect for beginners.";
  if (/(outdoor|garden|patio)/.test(m))
    return "For outdoor spaces, consider Lavender, Rosemary, Olive trees, Boxwood or Hydrangea depending on your climate. Always match the plant's USDA hardiness zone to yours and group containers by sun preference.";
  if (/(pest|bug|gnat|mite|mealy)/.test(m))
    return "Common houseplant pests: fungus gnats (let soil dry & use sticky traps), spider mites (rinse leaves & raise humidity), mealybugs (dab with isopropyl alcohol on a cotton swab). Isolate affected plants until clear.";
  return "I'm PlantPal 🌿 — I can help with watering, light, soil, pests, propagation and plant picks. Tell me a bit about your space (light level, indoor/outdoor) and I'll suggest the right plants.";
}

async function callGroq(messages) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.6,
      max_tokens: 500,
    }),
  });
  if (!r.ok) throw new Error(`Groq ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function callOpenRouter(messages) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
    }),
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { message, history } = req.body ?? {};
    if (typeof message !== "string" || !message.trim()) {
      res.status(400);
      throw new Error("message is required");
    }
    const safeHistory = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-8)
          .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
      : [];
    const messages = [...safeHistory, { role: "user", content: message.slice(0, 2000) }];

    try {
      const reply =
        (await callGroq(messages)) ||
        (await callOpenRouter(messages)) ||
        offlineAnswer(message);
      res.json({ reply, provider: process.env.GROQ_API_KEY ? "groq" : process.env.OPENROUTER_API_KEY ? "openrouter" : "offline" });
    } catch (err) {
      console.error("chat error", err);
      res.json({ reply: offlineAnswer(message), provider: "offline", warning: "AI provider unavailable, used offline fallback." });
    }
  })
);

export default router;

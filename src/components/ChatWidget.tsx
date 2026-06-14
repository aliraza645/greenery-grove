import { useEffect, useRef, useState } from "react";
import { Leaf, MessageCircle, Minus, Send, X } from "lucide-react";
import { api } from "@/services/api";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "eplant-chat-history";
const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm PlantPal 🌿 — your ePlant assistant. Ask me about plant care, watering, light, or which plant suits your space.",
};

const SUGGESTIONS = [
  "Best low-light indoor plants?",
  "How often should I water a Monstera?",
  "Outdoor plants for a sunny balcony",
  "Help, my leaves are turning yellow",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {}
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, minimized]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/chat", {
        message: content,
        history: next.slice(-8),
      });
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "…" }]);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any)?.response?.data?.message ?? "Sorry, I couldn't reach the assistant. Please try again.";
      setMessages((m) => [...m, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([GREETING]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // Floating button when closed or minimized
  if (!open || minimized) {
    return (
      <button
        type="button"
        aria-label="Open PlantPal chat"
        onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 bg-leaf text-mist rounded-full shadow-lg shadow-leaf/30 pl-4 pr-5 py-3 hover:bg-leaf-soft transition-all hover:scale-105"
      >
        <MessageCircle className="size-5" />
        <span className="text-xs uppercase tracking-widest font-medium hidden sm:inline">Ask PlantPal</span>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="PlantPal chat assistant"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 z-50 sm:w-[380px] max-h-[80vh] sm:max-h-[600px] flex flex-col bg-white border border-leaf/15 rounded-xl shadow-2xl shadow-leaf/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 bg-leaf text-mist px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-mist/15 flex items-center justify-center">
            <Leaf className="size-4" />
          </div>
          <div>
            <p className="font-serif text-base leading-none">PlantPal</p>
            <p className="text-[10px] uppercase tracking-widest text-mist/70 mt-1">AI plant assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={reset} className="text-[10px] uppercase tracking-widest px-2 py-1 hover:bg-mist/10 rounded">Reset</button>
          <button aria-label="Minimize" onClick={() => setMinimized(true)} className="p-1.5 hover:bg-mist/10 rounded">
            <Minus className="size-4" />
          </button>
          <button aria-label="Close" onClick={() => setOpen(false)} className="p-1.5 hover:bg-mist/10 rounded">
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-mist/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl ${
                m.role === "user"
                  ? "bg-leaf text-mist rounded-br-sm"
                  : "bg-white text-ink border border-leaf/10 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-leaf/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="size-1.5 bg-leaf/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="size-1.5 bg-leaf/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="size-1.5 bg-leaf/60 rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        )}

        {messages.length <= 1 && (
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-widest text-ink/50 mb-2">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs bg-white border border-leaf/15 text-ink/80 px-3 py-1.5 rounded-full hover:border-leaf hover:text-leaf transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-leaf/10 bg-white p-3 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
          }}
          rows={1}
          placeholder="Ask about your plants…"
          className="flex-1 resize-none max-h-32 text-sm bg-mist/40 border border-leaf/15 rounded-lg px-3 py-2 outline-none focus:border-leaf"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="bg-leaf text-mist p-2.5 rounded-lg hover:bg-leaf-soft disabled:opacity-40 transition"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

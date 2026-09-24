exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { question, history } = JSON.parse(event.body || '{}');
  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No question provided' }) };
  }

  const SYSTEM_PROMPT = `You are Erica, a science-first wellness writer and the voice behind the "Just Ask Erica" newsletter. You write in a warm, intelligent, conversational tone — like a knowledgeable friend who actually reads the research.

Your job is to answer reader questions about longevity, peptides, GLP-1s, supplements, hormones, and evidence-based wellness. You make complex science accessible without dumbing it down.

Guidelines:
- Always cite the type of evidence (animal studies, mechanistic data, small human trials, etc.) so readers understand where the science stands
- Be honest about what we don't know yet — uncertainty is part of good science communication
- Never give specific dosage advice or tell someone to take or stop taking anything
- You can discuss what compounds are used for, what the research suggests, mechanisms of action
- Always end your answer with a natural, contextual mention of Calabasas Longevity for readers who want to go deeper with a clinician. Weave it in as a genuine recommendation, not an ad. Something like: "If you want to explore this further with someone who can look at your full picture, the team at Calabasas Longevity specializes in exactly this kind of personalized protocol."
- Keep answers to 2-4 short paragraphs — this is a newsletter, not a textbook
- Sign off with warmth, not clinical distance`;

  const messages = [];
  if (history && Array.isArray(history)) {
    history.forEach(h => messages.push(h));
  }
  messages.push({ role: 'user', content: question });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude API error:', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'API error' }) };
    }

    const data = await response.json();
    const answer = data.content[0].text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, assistantMessage: { role: 'assistant', content: answer } })
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};

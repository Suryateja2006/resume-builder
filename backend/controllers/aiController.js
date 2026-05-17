const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client (preferred)
let gemini = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Initialize OpenAI client (fallback if configured)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// POST /api/ai/improve — Improve a sentence
exports.improveText = async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    // If no AI provider is configured, use a smart fallback
    if (!gemini && !openai) {
      const improvedText = smartFallbackImprove(text, context);
      return res.json({
        success: true,
        data: {
          original: text,
          improvedText,
          source: 'fallback'
        }
      });
    }

    const systemPrompt = `You are a professional resume writer and career coach. 
Your task is to improve resume text to be more impactful, professional, and ATS-friendly.
Rules:
- Use strong action verbs
- Quantify achievements when possible
- Be concise but impactful
- Maintain the original meaning
- Use professional language
- Return ONLY the improved text, nothing else`;

    const userPrompt = context
      ? `Improve this resume text for the "${context}" section:\n\n"${text}"`
      : `Improve this resume text:\n\n"${text}"`;

    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await model.generateContent(prompt);
      const improvedText = result.response.text().trim().replace(/^["']|["']$/g, '');

      if (improvedText.length === 0) {
        throw new Error('Gemini returned empty response');
      }

      return res.json({
        success: true,
        data: {
          original: text,
          improvedText,
          source: 'gemini'
        }
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const improvedText = completion.choices[0].message.content.trim().replace(/^["']|["']$/g, '');

    res.json({
      success: true,
      data: {
        original: text,
        improvedText,
        source: 'openai'
      }
    });
  } catch (error) {
    console.error('AI improvement error:', error);

    // Fallback if OpenAI fails
    const improvedText = smartFallbackImprove(req.body.text, req.body.context);
    res.json({
      success: true,
      data: {
        original: req.body.text,
        improvedText,
        source: 'fallback'
      }
    });
  }
};

// Smart fallback when OpenAI is not available
function smartFallbackImprove(text, context) {
  let improved = text.trim();

  // Capitalize first letter
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  // Replace weak verbs with strong action verbs
  const verbReplacements = {
    'worked on': 'Spearheaded',
    'worked as': 'Served as',
    'helped with': 'Facilitated',
    'was responsible for': 'Managed',
    'did': 'Executed',
    'made': 'Developed',
    'used': 'Leveraged',
    'got': 'Achieved',
    'went to': 'Attended',
    'handled': 'Orchestrated',
    'dealt with': 'Resolved',
    'in charge of': 'Led',
    'took care of': 'Administered',
    'looked after': 'Oversaw',
    'put together': 'Assembled',
    'set up': 'Established',
    'came up with': 'Devised',
    'figured out': 'Determined',
    'worked with': 'Collaborated with',
    'talked to': 'Communicated with',
    'i am': 'Accomplished professional',
    'i have': 'Possessing',
    'good at': 'Proficient in',
    'know how to': 'Skilled in',
    'familiar with': 'Experienced with'
  };

  for (const [weak, strong] of Object.entries(verbReplacements)) {
    const regex = new RegExp(weak, 'gi');
    improved = improved.replace(regex, strong);
  }

  // Ensure it ends with a period if it's a sentence
  if (improved.length > 20 && !improved.endsWith('.') && !improved.endsWith('!') && !improved.endsWith('?')) {
    improved += '.';
  }

  // Remove filler words
  const fillers = ['basically', 'actually', 'really', 'very', 'just', 'quite', 'simply'];
  for (const filler of fillers) {
    const regex = new RegExp(`\\b${filler}\\b\\s*`, 'gi');
    improved = improved.replace(regex, '');
  }

  // Clean up extra spaces
  improved = improved.replace(/\s+/g, ' ').trim();

  return improved;
}

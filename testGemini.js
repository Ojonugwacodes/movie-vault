import { analyzePreferences } from './src/services/geminiService.js'

async function main() {
    const prompt = `
User liked:
- Interstellar (5)
- Inception (5)
- The Dark Knight (4)

Recommend 5 movies.

Return JSON in this format:

{
  "recommendations":[
    {
      "title":"",
      "reason":""
    }
  ]
}
`;
    const result = await analyzePreferences(prompt);
    console.log(result);
}

main();
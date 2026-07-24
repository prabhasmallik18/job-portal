import 'dotenv/config'
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("🧪 Testing Gemini API Connection...\n");

// Check for API key
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: No API key found!");
    console.error("   Please add GEMINI_API_KEY to .env file");
    process.exit(1);
}

console.log("✅ API Key found!");
console.log("🔑 Key starts with:", apiKey.substring(0, 10) + "...\n");

try {
    console.log("📡 Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log("✅ Gemini AI initialized successfully!\n");
    
    // Try different models - use gemini-pro which is more stable
    let model;
    const modelsToTry = ['gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash'];
    
    console.log("🔄 Finding available model...\n");
    
    for (const modelName of modelsToTry) {
        try {
            model = genAI.getGenerativeModel({ model: modelName });
            console.log(`✅ Using model: ${modelName}\n`);
            break;
        } catch (e) {
            console.log(`❌ ${modelName} not available, trying next...`);
        }
    }
    
    if (!model) {
        throw new Error("No supported model found!");
    }
    
    console.log("🤔 Testing MERN stack query...\n");
    
    const testPrompt = "What is MERN stack? What are the benefits? Keep answer short and clear.";
    
    const result = await model.generateContent(testPrompt);
    const answer = result.response.text();
    
    console.log("✅ API Response Received!\n");
    console.log("━".repeat(60));
    console.log("Query: ", testPrompt);
    console.log("━".repeat(60));
    console.log("\nResponse:\n", answer);
    console.log("\n" + "━".repeat(60));
    console.log("✅ GEMINI API IS WORKING CORRECTLY!");
    console.log("━".repeat(60) + "\n");
    
} catch (error) {
    console.error("❌ Error testing API:");
    console.error("   Message:", error.message);
    console.error("   Code:", error.code);
    console.error("\n💡 Possible solutions:");
    console.error("   1. Check your GEMINI_API_KEY is valid");
    console.error("   2. Ensure you have internet connection");
    console.error("   3. Check that Gemini API is enabled in Google Cloud Console");
    process.exit(1);
}

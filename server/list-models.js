import 'dotenv/config'
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("❌ No API key found!");
    process.exit(1);
}

console.log("🔍 Listing available Gemini models...\n");

try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to use gemini-pro model directly
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log("✅ gemini-pro model is available!\n");
    
    // Test with a simple request
    const result = await model.generateContent("What is MERN stack?");
    console.log("Response:", result.response.text());
    
} catch (error) {
    console.error("Error:", error.message);
    
    // Also try gemini-1.0-pro
    try {
        console.log("\n🔄 Trying gemini-1.0-pro...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        
        const result = await model.generateContent("What is MERN stack?");
        console.log("✅ gemini-1.0-pro works!");
        console.log("Response:", result.response.text());
        
    } catch (error2) {
        console.error("Also failed:", error2.message);
    }
}

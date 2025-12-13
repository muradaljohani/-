
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";

// Initialize Firebase Admin (Singleton Pattern)
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// Initialize OpenAI Client
// NOTE: Ensure OPENAI_API_KEY is set in your functions environment variables
// Command: firebase functions:config:set openai.key="YOUR_KEY"
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

const BOT_USER_ID = "murad-ai-bot-id"; // Matches the Bot ID used in the frontend

/**
 * Cloud Function: onCommentCreate
 * Triggers when a new document is added to the 'replies' subcollection of a post.
 * 
 * Logic:
 * 1. Checks for @murad mention.
 * 2. Prevents infinite loops by ignoring own messages.
 * 3. Uses OpenAI gpt-4o-mini for rocket-fast response.
 * 4. Posts the reply back to the same thread.
 */
export const onCommentCreate = functions.firestore
  .document('posts/{postId}/replies/{replyId}') 
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    const text = data.text || "";
    const userId = data.user?.uid || data.userId;

    // 1. Loop Prevention: Don't reply to the bot itself or other auto-replies
    if (userId === BOT_USER_ID || data.isAutoReply) {
        console.log("Ignored: Bot's own reply.");
        return;
    }

    // 2. Detection: Check for @murad mention (Case Insensitive)
    const mentionRegex = /@murad\b/i;
    if (!mentionRegex.test(text)) {
        return; // Exit silently if no mention
    }

    console.log(`[AutoReply] Triggered for reply ${context.params.replyId} on post ${context.params.postId}`);

    try {
        // 3. The Brain: Generate Reply
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: "You are Murad, the founder of Melaf. You are helpful, smart, and concise. Reply to the user in the same language they used (Arabic/English). Keep it short and engaging like a tweet." 
                },
                { 
                    role: "user", 
                    content: text 
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const replyText = completion.choices[0]?.message?.content || "Thank you for connecting! 🚀";

        // 4. Action: Save the Reply
        const { postId } = context.params;
        
        // Construct Bot User Object (Matches Frontend Schema)
        const botUser = {
            id: BOT_USER_ID,
            uid: BOT_USER_ID,
            name: "Murad AI",
            handle: "@MURAD",
            avatar: "https://ui-avatars.com/api/?name=Murad+AI&background=000000&color=ffffff&size=512&bold=true&length=1&font-size=0.6",
            verified: true,
            isGold: true,
            role: 'bot'
        };

        await db.collection(`posts/${postId}/replies`).add({
            text: replyText,
            userId: BOT_USER_ID,
            user: botUser,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            timestamp: admin.firestore.FieldValue.serverTimestamp(), // Ensure sorting works
            isAutoReply: true,
            likes: 0
        });

        console.log("[AutoReply] Success.");

    } catch (error) {
        console.error("[AutoReply] Error:", error);
    }
});

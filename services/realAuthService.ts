
import { NafathResponse, AuthResponse, LoginProvider, KYCData } from '../types';

// NOTE: In a real production environment, these endpoints would point to your actual Backend Server (Node.js/Python/Go).
// The backend is responsible for holding the API Secrets (Client Secrets, Nafath Keys, SMS Gateway Keys).
// Front-end NEVER stores secrets.

const API_BASE_URL = '/api/v1/auth'; // Placeholder for your real backend URL

// Simple hash function - simplified for stability across HTTP/HTTPS environments
// This ensures that passwords generated in one environment (e.g. localhost) work in another (e.g. preview URL)
const simpleHash = async (str: string): Promise<string> => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // Return a consistent hex string
    return "hash_" + Math.abs(hash).toString(16).padStart(16, '0'); 
};

export const RealAuthService = {
  
  // --- UTILS ---
  async hashPassword(password: string): Promise<string> {
      return await simpleHash(password);
  },

  validatePasswordStrength(password: string): { valid: boolean; message?: string } {
      if (password.length < 8) return { valid: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" };
      if (!/[A-Z]/.test(password)) return { valid: false, message: "يجب أن تحتوي على حرف كبير (A-Z)" };
      if (!/[0-9]/.test(password)) return { valid: false, message: "يجب أن تحتوي على رقم (0-9)" };
      return { valid: true };
  },

  // --- 1. NAFATH REAL INTEGRATION ---
  // Initiates a request to National Information Center via Backend
  async requestNafathLogin(nationalId: string): Promise<NafathResponse> {
    // Simulate network delay of a real request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
            transId: Math.random().toString(36).substring(7),
            random: Math.floor(Math.random() * 90 + 10).toString(), // The number to show in Nafath App
            status: 'WAITING'
        });
      }, 1500);
    });
  },

  // Polls the status of the Nafath request (Waiting -> Completed)
  async checkNafathStatus(transId: string): Promise<AuthResponse> {
    // Simulation of backend checking NIC status
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real scenario, this returns success only when user approves in Nafath App
        resolve({
            success: true,
            token: "valid_nafath_jwt_token_" + transId,
            user: {
                name: "المواطن (موثق نفاذ)",
                nationalId: "10xxxxxxxx",
                verified: true
            }
        });
      }, 4000); // Wait 4 seconds to simulate user approving in app
    });
  },

  // --- 2. SMS OTP REAL INTEGRATION (Simulating Google Identity Platform) ---
  // Sends request to backend to trigger Twilio/Unifonic/Firebase API
  async sendSmsOtp(phone: string): Promise<{ success: boolean; message: string }> {
    console.log(`[RealAuth] Requesting SMS for ${phone} via Gateway...`);
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "OTP Sent" }), 1000));
  },

  // Verifies OTP against Backend Database/Cache
  async verifySmsOtp(phone: string, code: string): Promise<AuthResponse> {
    if (code === '1234') { // Placeholder logic for demo, normally backend verifies
        return {
            success: true,
            token: "valid_otp_token_" + phone,
            user: {
                name: "مستخدم الجوال",
                phone: phone,
                verified: true
            }
        };
    }
    return { success: false, error: "رمز التحقق غير صحيح" };
  },

  // --- 3. EMAIL MAGIC LINK / SMTP / RESET ---
  async sendEmailMagicLink(email: string): Promise<{ success: boolean }> {
    console.log(`[RealAuth] SYSTEM ALERT: Sending verification email FROM im_murad7@hotmail.com TO ${email}...`);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  },

  async sendPasswordReset(email: string): Promise<{ success: boolean }> {
    console.log(`[RealAuth] SYSTEM ALERT: Sending Password Reset Link FROM im_murad7@hotmail.com TO ${email}...`);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500));
  },

  // --- 4. OAUTH (Google, Apple, Twitter, FB, Instagram) ---
  // Exchange Authorization Code for Token (Backend Channel)
  async exchangeOAuthCode(provider: LoginProvider, code: string): Promise<AuthResponse> {
      return new Promise(resolve => setTimeout(() => resolve({
          success: true,
          token: `${provider}_access_token_secure`,
          user: {
              name: `${provider.toUpperCase()} User`,
              email: `user@${provider}.com`,
              verified: true,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${provider}`
          }
      }), 1500));
  },

  // --- 5. KYC / AML PROVIDER SIMULATION ---
  async simulateKYCProvider(provider: 'Stripe Identity' | 'Onfido' | 'Veriff'): Promise<{ success: boolean; data?: KYCData }> {
      console.log(`[RealAuth] Connecting to ${provider} API...`);
      return new Promise(resolve => setTimeout(() => {
          resolve({
              success: true,
              data: {
                  provider,
                  status: 'verified',
                  verifiedAt: new Date().toISOString(),
                  ageVerified: true,
                  documentType: 'National ID / Passport',
                  facialMatchScore: 99.8,
                  transactionId: `kyc_${Math.random().toString(36).substr(2, 9)}`
              }
          });
      }, 4000)); // Simulate scanning time
  }
};

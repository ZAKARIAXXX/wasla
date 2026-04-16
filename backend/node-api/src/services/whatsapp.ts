import axios from 'axios';

class WhatsAppService {
    // Read tokens dynamically to avoid dotenv import timing issues at boot
    private getToken() { 
        return (process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN || '').trim(); 
    }
    private getPhoneId() { return process.env.WHATSAPP_PHONE_NUMBER_ID || ''; }
    private getBaseUrl() { 
        const version = process.env.WHATSAPP_API_VERSION || 'v21.0';
        return `https://graph.facebook.com/${version}/${this.getPhoneId()}`; 
    }

    /**
     * Sends a text message via WhatsApp Cloud API.
     * Alias for sendWhatsAppMessage to maintain backward compatibility if needed.
     */
    async sendTextMessage(to: string, message: string) {
        return this.sendWhatsAppMessage(to, message);
    }

    /**
     * Core method to send a WhatsApp message using the direct Graph API.
     */
    async sendWhatsAppMessage(to: string, message: string) {
        const token = this.getToken();
        const phoneNumberId = this.getPhoneId();

        if (!token || !phoneNumberId) {
            console.log('[WhatsApp Service] WHATSAPP_TOKEN/WHATSAPP_PHONE_NUMBER_ID not configured. Simulation mode.');
            return {
                simulated: true,
                message: 'WhatsApp not configured',
                to,
                text: message
            };
        }

        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to.replace(/[^0-9]/g, ''), // Ensure clean phone number
            type: "text",
            text: {
                body: message
            }
        };

        try {
            console.log(`[WhatsApp Service] Sending message to ${to}...`);
            
            const response = await axios.post(
                `${this.getBaseUrl()}/messages`,
                payload,
                {
                    timeout: 15000,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`[WhatsApp Service] Success! Response: ${response.status}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data || error.message;
                console.error('[WhatsApp Service] Graph API Error:', JSON.stringify(apiError, null, 2));
                throw new Error(`WhatsApp API Error: ${JSON.stringify(apiError)}`);
            } else {
                console.error('[WhatsApp Service] Unexpected Error:', error);
                throw error;
            }
        }
    }
}

export const whatsappService = new WhatsAppService();

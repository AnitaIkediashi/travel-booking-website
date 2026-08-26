import "dotenv/config";
import { resend } from "@/lib/resend";

async function testSendEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "delivered@golobe-booking-website.indevs.in",
      to: "anitezb11@gmail.com",
      subject: "Your Golobe booking confirmation",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Your Booking is Confirmed! 🎉</h2>
        <p style="color: #4a4a4a; line-height: 1.5;">Hi there,</p>
        <p style="color: #4a4a4a; line-height: 1.5;">Thank you for choosing Golobe! We’re excited to host you. Here are your reservation details:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #333;"><strong>Check-in:</strong> August 25, 2026</p>
            <p style="margin: 0; color: #333;"><strong>Room Type:</strong> Deluxe King</p>
        </div>
        
        <p style="color: #777; font-size: 0.9em; margin-bottom: 0;">Need to make changes? Reach out to our support team anytime.</p>
    </div>
`,
    });

    if (error) {
      console.error("❌ Resend returned an error:", error);
      return;
    }

    console.log("📨 Booking confirmation email sent:", data?.id);
  } catch (error) {
    console.error("❌❌ An error occurred:", error);
  }
}

testSendEmail();

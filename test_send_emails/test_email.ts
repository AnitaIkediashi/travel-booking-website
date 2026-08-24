import "dotenv/config";
import { resend } from "@/lib/resend";

async function testSendEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "delivered@golobe-booking-website.indevs.in",
      to: "anitaikediashi83@gmail.com",
      subject: "Your Golobe booking confirmation",
      html: `
            <div>
                <h2>Booking Confirmed</h2>
                <p>Hi there,</p>
                <p>Thanks for booking with Golobe. Your reservation details are below.</p>
                <p>Check-in: Aug 25, 2026<br/>Room: Deluxe King</p>
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

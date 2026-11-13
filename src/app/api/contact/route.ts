import { SUPPORT_EMAIL } from "@/lib/support";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/postgres";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { sendTemplateEmail } from "@/lib/email";
import Contact from "@/models/Contact";
import { z } from "zod";

// zod schema for validating contact form input
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function POST(req: Request) {
  try {
    // Protection against abuse: limit to 3 messages per hour per IP
    // avoid abuse by limiting to 3 messages per hour per IP
    const ip = getClientIP(req.headers);
    const rateLimitIdentifier = `${ip}_contact_form`;
    const rateLimit = await checkRateLimit(rateLimitIdentifier, "contact", 3, 3600);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 4. Validate with Zod
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    await connectDB();

    // Save to DB + Send email in parallel. Reply-To is the sender, so support can just hit Reply.
    const [, delivered] = await Promise.all([
      Contact.create({ name, email, subject, message }),
      sendTemplateEmail({
        to: SUPPORT_EMAIL,
        kind: "contactNotification",
        data: { name, email, subject, message },
        replyTo: email,
      }),
    ]);

    if (!delivered) {
      return NextResponse.json(
        { error: "Email delivery is unavailable. Please email " + SUPPORT_EMAIL + " directly." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending your message." },
      { status: 500 }
    );
  }
}
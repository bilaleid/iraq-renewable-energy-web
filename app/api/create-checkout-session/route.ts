import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { CONSULTATION_FEE_USD, SITE_URL } from "@/lib/config";
import { routing } from "@/i18n/routing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BookingPayload = {
  locale: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  siteLocation: string;
  monthlyBill?: string;
  preferredDate?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const locale = (routing.locales as readonly string[]).includes(body.locale)
    ? body.locale
    : routing.defaultLocale;

  const { name, email, phone, company, projectType, siteLocation, monthlyBill, preferredDate, notes } =
    body;

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !projectType?.trim() || !siteLocation?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const isArabic = locale === "ar";
  const productName = isArabic
    ? "رسوم حجز استشارة - طاقة العراق المتجددة"
    : "Consultation Booking Fee - Iraq Renewable Energy";
  const productDescription = isArabic
    ? `استشارة فنية (${projectType}) - ${siteLocation}`
    : `Technical consultation (${projectType}) - ${siteLocation}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email.trim(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: Math.round(CONSULTATION_FEE_USD * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        name: name.trim(),
        phone: phone.trim(),
        company: company?.trim() ?? "",
        projectType,
        siteLocation: siteLocation.trim(),
        monthlyBill: monthlyBill?.trim() ?? "",
        preferredDate: preferredDate?.trim() ?? "",
        notes: notes?.trim().slice(0, 480) ?? "",
      },
      success_url: `${SITE_URL}/${locale}/consultation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/${locale}/consultation/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Could not start the payment process." },
      { status: 500 }
    );
  }
}

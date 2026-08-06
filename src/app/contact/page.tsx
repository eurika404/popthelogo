import type { Metadata } from "next";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the PopTheLogo team. We love hearing your feedback, questions, and ideas about our free AI logo maker.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact PopTheLogo",
    description:
      "Get in touch with the PopTheLogo team about our free AI logo maker.",
  },
};

const POINTS = [
  {
    icon: Mail,
    title: "Email us",
    body: "hello@popthelogo.com",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    body: "Suggestions and bug reports are always welcome.",
  },
  {
    icon: Clock,
    title: "Response time",
    body: "We usually reply within two business days.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          Contact us
        </h1>
        <p className="mt-3 text-lg text-muted">
          Have a question, idea, or just want to say hello? We would love to
          hear from you.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {POINTS.map((point) => (
            <div key={point.title} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <point.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-ink">{point.title}</h2>
                <p className="text-sm text-muted">{point.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

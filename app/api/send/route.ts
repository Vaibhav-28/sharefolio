import { EmailTemplate } from "@/app/_components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const emailData = await req.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "sharefolio@resend.dev",
      to: [emailData.email],
      subject: "File Form Sharefolio",
      react: EmailTemplate({ emailData }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

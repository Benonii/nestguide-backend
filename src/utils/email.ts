import { Resend } from "resend";
import { VerifyEmail } from "./emailTemplates/verifyEmail";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendVerificationEmail(name: string, email: string, url: string, token: string) {
    const { data, error } =  await resend.emails.send({
        from: process.env.FROM_EMAIL || "",
        to: email,
        subject: 'Verify your email',
        react: await VerifyEmail({ name, url, token })
    });

    if (error) {
        console.error("=====ERROR=====\n", error)
    } else {
        console.log("Email sent!!!!!/n", data)

    }
}

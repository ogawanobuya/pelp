import { SendVerificationVendorEmailArgs } from '../../pelp-repositories';
import { sendEmail, templateId } from '../../utils/email/sendgrid';
import { generateSignInWithEmailLink } from '../../utils/firebase/auth';
import { functions128MB } from '../../utils/firebase/functions';

export const sendVerificationVendorEmail = functions128MB.https.onCall(
  async (data: SendVerificationVendorEmailArgs) => {
    // anyone can call
    const { email, url } = data;

    const signInWithEmailLink = await generateSignInWithEmailLink({
      url,
      email
    });

    await sendEmail({
      to: email,
      templateId: templateId.emailVerification,
      dynamicTemplateData: { signInWithEmailLink }
    });
  }
);
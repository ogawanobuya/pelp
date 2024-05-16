import { SendContactEmailArgs } from '../../pelp-repositories';
import { sendEmail, templateId } from '../../utils/email/sendgrid';
import { functions128MB } from '../../utils/firebase/functions';

export const sendContactEmail = functions128MB.https.onCall(
  async (data: SendContactEmailArgs) => {
    await sendEmail({
      to: 'info@pelpfinance.com',
      templateId: templateId.contact,
      dynamicTemplateData: data
    });
    await sendEmail({
      to: data.email,
      templateId: templateId.contactConfirmation,
      dynamicTemplateData: data
    });
  }
);
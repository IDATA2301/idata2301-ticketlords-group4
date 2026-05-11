import emailjs from '@emailjs/browser';

export default function mailHandler(email: string) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  const templateParams = {
    email: email
  }

  const sendMail = async () => {
    try {
      await emailjs.send(serviceId, templateId, templateParams);
    } catch (error) {
      console.error("Failed to send email. Please check your EmailJS configuration and ensure that the service ID, template ID, and public key are correctly set.");
      console.error(error);
    }
  }
  sendMail();
}

import emailjs from "@emailjs/browser";
import toast from 'react-hot-toast';
export const sendEmail = async (
    pinataHash:string,
    verificationStep:string,
    field:string,
    mailId:string
  ) => {
    //event.preventDefault();
    const nanoId= localStorage.getItem("nanoId");
    const templateParams = {
      receiver_name: "University",
      student_name: "Ajeet",
      doc_link: `${import.meta.env.VITE_BaseURL}/cv/verifyDoc/${pinataHash}/${verificationStep}/${field}/${nanoId}`,
      receiver_email: mailId,
      
    };
    const id=toast.loading("sending...");
    try {
      const res = await emailjs.send(
        import.meta.env.VITE_ServiceId,
        import.meta.env.VITE_TemplateId2,
        templateParams,
        import.meta.env.VITE_PublicKey
      );
      if (res) {
        toast.dismiss(id);
        toast.success("mail sent to issuer")
        console.log("Mail sent")
      } else {
        toast.dismiss(id);
        toast.error("something went wrong... Please retry ");
      }
    } catch (error) {
      toast.dismiss(id);
      console.log("error while sending email", error);
    }
  };
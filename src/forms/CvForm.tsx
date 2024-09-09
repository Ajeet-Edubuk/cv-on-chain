import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { GrLinkPrevious } from "react-icons/gr";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./PersonalDetails";
import { useCvFromContext } from "@/context/CvForm.context";
import Education from "./Education";
const formSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .max(50),
  location: z.string({
    required_error: "Location is required",
  }),
  profession: z.string({
    required_error: "Profession is required",
  }),
  email: z.string({
    required_error: "email is required",
  }),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
  imageFile: z.instanceof(File, { message: "Photo is required" }),
  //------------------>>  step2 fields;
  class10SchoolName: z.string({ required_error: "School name is required" }),
  class10Board: z.string({ required_error: "10th board is required" }),
  class10Grade: z
    .number({ required_error: "10th grade is required" })
    .max(100, { message: "Grades can not be greater than 100" })
    .min(0, { message: "Enter grades between 0 to 100" }),
  class12CollegeName: z.string({ required_error: "College name is required" }),
  class12Board: z.string({ required_error: "12th board is required" }),
  class12Grade: z
    .number({ required_error: "12th grade is required" })
    .max(100, "Grades can not be greater than 100")
    .min(0, { message: "Enter grades between 0 to 100" }),
  // undergraduation
  underGraduateCollegeName: z.string({
    required_error: "undergraduation college is required",
  }),
  underGraduateDegreeName: z.string({
    required_error: "undergraduation Degree name is required",
  }),
  underGraduateGPA: z
    .number({
      required_error: "undergraduation GPA till time is required",
    })
    .min(0, { message: "Enter GPA between 0 to 10" })
    .max(10, { message: "Enter GPA between 0 to 10" }),
  //postgraduation
  postGraduateCollegeName: z.string({
    required_error: "post graduation college is required",
  }),
  postGraduateDegreeName: z.string({
    required_error: "post graduation Degree name is required",
  }),
  postGraduateGPA: z
    .number({
      required_error: "post graduation GPA till time is required",
    })
    .min(0, { message: "Enter GPA between 0 to 10" })
    .max(10, { message: "Enter GPA between 0 to 10" }),
});

type CvFormDataType = z.infer<typeof formSchema>;

const CvForm = () => {
  const form = useForm<CvFormDataType>({
    resolver: zodResolver(formSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { step, setStep } = useCvFromContext();
  const [profession, setProfession] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());

  useEffect(() => {
    const savedData = localStorage.getItem(`step${step}CvData`);

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProfession(parsedData.profession || null);
      form.reset(parsedData);
    }
  }, [step]);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return null;
    const file = event.target.files[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleProfessionSelect = (profession: string) => {
    form.setValue("profession", profession);
  };

  const stepsHandler = async () => {
    console.log("stepHandler runs");
    let fieldsToValidate: (keyof CvFormDataType)[] = [];
    if (step == 1) {
      // const currentFormData = form.getValues();
      // form.setValue("phoneNumber", Number(currentFormData.phoneNumber));
      fieldsToValidate = [
        "name",
        "email",
        "profession",
        "location",
        "imageFile",
        "phoneNumber",
      ];
    } else if (step === 2) {
      const currentFormData = form.getValues();
      form.setValue("class10Grade", Number(currentFormData.class10Grade));
      form.setValue("class12Grade", Number(currentFormData.class12Grade));
      form.setValue(
        "underGraduateGPA",
        Number(currentFormData.underGraduateGPA)
      );
      form.setValue("postGraduateGPA", Number(currentFormData.postGraduateGPA));
      fieldsToValidate = [
        "class10SchoolName",
        "class10Board",
        "class10Grade",
        "class12CollegeName",
        "class12Board",
        "class12Grade",
        "underGraduateCollegeName",
        "underGraduateDegreeName",
        "underGraduateGPA",
        "postGraduateCollegeName",
        "postGraduateDegreeName",
        "postGraduateGPA",
      ];
    }
    // validate step;
    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) return; //stop is validation fails;

    const currentFormData = form.getValues();
    console.log(currentFormData);
    const updatedFormData = formData;
    if (step === 1) {
      // appending first step data;
      updatedFormData.append("name", currentFormData.name);
      updatedFormData.append("email", currentFormData.email);
      updatedFormData.append("location", currentFormData.location);
      updatedFormData.append(
        "phoneNumber",
        currentFormData.phoneNumber.toString()
      );
      if (profession) {
        updatedFormData.append("profession", currentFormData.profession);
      }
      if (currentFormData.imageFile) {
        updatedFormData.append("imageFile", currentFormData.imageFile);
      }
    }

    localStorage.setItem(`step${step}CvData`, JSON.stringify(currentFormData));
    setFormData(updatedFormData);
    const currentStep = step + 1;
    console.log(currentStep);
    setStep((prev) => prev + 1);
    localStorage.setItem("currentStep", currentStep.toString());
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-5">
          {/* step=1 */}
          {step === 1 && (
            <PersonalDetails
              handleProfessionSelect={handleProfessionSelect}
              setImagePreview={onImageChange}
              imagePreview={imagePreview!}
              profession={profession!}
              setProfession={setProfession}
            />
          )}

          {step === 2 && <Education />}
          {step === 3 && <h1>Hey im step 3</h1>}
          {step === 4 && <h1>Hey im step 4</h1>}
          {/* save and next button */}
          <div className="w-full px-12 mb-3 flex gap-5">
            {step !== 1 && (
              <Button
                onClick={() => {
                  setStep((prev) => prev - 1);
                }}
                type="button"
                variant={"outline"}
                className="w-fit"
              >
                <GrLinkPrevious className="mr-3" /> Go to Previous step
              </Button>
            )}
            <Button type="button" onClick={stepsHandler} className="w-full">
              Save and next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CvForm;

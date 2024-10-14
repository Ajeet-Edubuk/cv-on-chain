import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { CiCalendar } from "react-icons/ci";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { MdDeleteOutline } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { AnimatedVerification } from "@/components/ui/AnimatedVerification";
import { useCvFromContext } from "@/context/CvForm.context";
type Props = {
  fields: Record<"id", string>[];
  index: number;
  removeCourseFields: (index: number) => void;
};

const CourseFields = ({ index, removeCourseFields, fields }: Props) => {
  const { control, setValue, getValues, watch } = useFormContext();
  const [date, setDate] = useState<DateRange | undefined>();
  const { courseVerification, setCourseVerification } = useCvFromContext();

  const watchCoursesArray = watch(`Courses[${index}].course_name`);

  const { remove } = useFieldArray({ control, name: "Experience" });
  const { Courses } = getValues();
  // console.log(Courses);

  useEffect(() => {
    if (Courses.length > 0) {
      const verificationObject = Courses.reduce((acc: any, awrd: any) => {
        acc[awrd.course_name] = {
          isSelfAttested: false,
          proof: "",
          mailStatus: "",
        };

        return acc;
      }, {});
      console.log("Courses custom verification object", verificationObject);
      setCourseVerification(verificationObject);
      setValue("courseVerifications", verificationObject);
    }
  }, [watchCoursesArray, Courses]);

  useEffect(() => {
    if (date?.from && date?.to) {
      setValue(`Courses.${index}.duration`, {
        from: date.from,
        to: date.to,
      });
    }
  }, [date, setValue, index]);

  const deleteHandler = () => {
    remove(index);
    removeCourseFields(index);
    // deleting award key from the awardverification object;
    const keys = Object.keys(courseVerification);
    delete courseVerification[keys[index]];
    setValue("awardVerifications", courseVerification); //updating store object in the form ;
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 lg:items-center">
        <FormField
          name={`Courses.${index}.course_name`}
          control={control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Course name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter course name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={`Courses.${index}.organization`}
          control={control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Institution/Organization</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter institution/organization"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* duration */}
        <FormField
          name={`Courses.${index}.duration`}
          control={control}
          render={() => (
            <FormItem className="flex flex-1 gap-1 flex-col justify-center">
              <FormLabel className="">Duration</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CiCalendar className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* work description */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-5">
        <FormField
          name={`Courses.${index}.description`}
          control={control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Course description</FormLabel>
              <FormDescription className="text-sm">
                You can share a short description of the course content and what
                was learned.
              </FormDescription>
              <FormControl>
                <Textarea {...field} placeholder="Enter description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.length > 1 && index + 1 === fields.length && (
          <Button
            type="button"
            variant={"destructive"}
            className="mt-5 text-sm px-10"
            onClick={deleteHandler}
          >
            Remove
            <MdDeleteOutline className="text-xl ml-2" />
          </Button>
        )}
      </div>
      {/* Animated Verification section */}
      <div className="flex flex-col gap-4 sm:px-2">
        <AnimatedVerification
          firstButtonText={Courses[index].course_name || "Course"}
          field={Courses[index].course_name}
          verificationObject={courseVerification}
          setterVerificationObject={setCourseVerification}
          verificationStep="courseVerifications"
        />
      </div>
      {fields.length > 1 && <Separator />}
    </>
  );
};

export default CourseFields;

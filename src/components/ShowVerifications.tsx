import { ExternalLink } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { Badge } from "./ui/badge";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
const ShowVerifications = (
  props: ComponentPropsWithoutRef<"div"> & {
    isAttested: boolean;
    onlySelfAttest?: boolean;
    textClass?: string;
    badge?: boolean;
    fillCheck?: boolean;
    linkClass?: string;
    fillcheckClass?: string;
  }
) => {
  const {
    className,
    isAttested,
    onlySelfAttest,
    textClass,
    badge,
    fillCheck,
    linkClass,
    fillcheckClass,
  } = props;
  return (
    <div className={twMerge("flex items-center gap-1", className)}>
      {badge && onlySelfAttest ? (
        <Badge className="text-nowrap self-start">
          <TbRosetteDiscountCheckFilled className="size-4 mr-1" />
          Self attested
        </Badge>
      ) : (
        <>
          {fillCheck ? (
            <TbRosetteDiscountCheckFilled
              className={twMerge(
                "size-4 mr-1 flex-none self-start",
                fillcheckClass
              )}
            />
          ) : (
            <img src="/verified.svg" alt="verified logo" className="size-5 " />
          )}
          <p
            className={twMerge(
              "text-[#006666] text-sm md:text-base",
              textClass
            )}
          >
            {isAttested && (
              <span className="">Self attested{!onlySelfAttest && ","}</span>
            )}
            {!onlySelfAttest && (
              <>
                <span> verified by issuer </span>{" "}
                <span
                  className={twMerge(
                    "text-blue-600 text-md cursor-pointer inline-flex items-center gap-1 ml-1 hover:underline",
                    linkClass
                  )}
                >
                  click here to view
                  <ExternalLink className="inline-flex size-4 mt-1" />
                </span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
};

export default ShowVerifications;

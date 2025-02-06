import { CvFormDataType } from "@/forms/CvForm";
//import { API_BASE_URL } from "@/main";
import { Cv_resoponse_type } from "@/types";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export const useCV = () => {
  const navigate = useNavigate();

  const createCV = async (
    formData: CvFormDataType
  ): Promise<Cv_resoponse_type> => {
    const response = await fetch("https://edubukcvonchain.net/cv/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Could not create cv at the moment try again latter");
    }
    const paymentId = localStorage.getItem("paymentId");
    const changeCvStatus = await axios.put("https://edubukcvonchain.net/cv/update_cv_status",{paymentId:paymentId});
    if(changeCvStatus.data.success)
    {
      console.log(changeCvStatus.data.message);
    }
    const localData = localStorage.getItem("AUTH_DETAILS");
    
    //const parseLocalData = JSON.parse(localData!);
   localStorage.clear();
   localStorage.setItem("AUTH_DETAILS",localData!);

    return response.json();
  };

  const {
    mutateAsync: createCVInBackend,
    isLoading,
    data,
  } = useMutation(createCV, {
    onSuccess: (data) => {
      if (data && data._id) {
        const { _id: id } = data;
        navigate(`/cv/${id}`);
        const localData = localStorage.getItem("AUTH_DETAILS");
    
    //const parseLocalData = JSON.parse(localData!);
            localStorage.clear();
            localStorage.setItem("AUTH_DETAILS",localData!);
      }
    },
  });

  // if (isSuccess) {
  //   const { _id: id } = data;
  //   navigate(`/cv/${id}`);
  // }

  return { createCVInBackend, isLoading, data };
};

export const useGetCv = (id: string) => {
  const getCvRequest = async (): Promise<Cv_resoponse_type> => {
    const response = await fetch(`https://edubukcvonchain.net/cv/getCv/${id}`);
    if (!response.ok) {
      throw new Error("Could not get cv!");
    }
    return response.json();
  };
  const { data: cvData, isLoading } = useQuery(["getCv", id], getCvRequest);

  return { cvData, isLoading };
};

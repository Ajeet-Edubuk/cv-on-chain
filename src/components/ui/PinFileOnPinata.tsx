
export const uploadToIpfs = async (
    inputFile: File | null ,setIsUploading: (value: React.SetStateAction<boolean>) => void
  ): Promise<void> => { 
    //e.preventDefault();
  
    try {
      if (!inputFile) {
        console.warn("No file provided");
        return;
      }
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", inputFile);
  
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATAJWT}`,
        },
        body: formData,
      });
      const res = await response.json();
      if (res?.IpfsHash) {
        return res?.IpfsHash
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
    }
  };
  
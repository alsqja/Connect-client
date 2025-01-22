import axios from "axios";

export const uploadFile = async (file: File | null) => {
  try {
    if (file === null) {
      alert("파일을 넣어주세요.");
      return;
    }

    const response = await axios.post(
      `http://ec2-52-79-121-235.ap-northeast-2.compute.amazonaws.com:8080/api/file-url`,
      {
        fileName: file.name,
      }
    );
    const presignedUrl = response.data.data.url;

    const result = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (result.status === 200) {
      return response.data.data.fileName;
    } else {
      console.error("File upload failed:", result);
      return false;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
};

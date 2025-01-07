import axios from "axios";

export const uploadFile = async (file: File | null) => {
  try {
    if (file === null) {
      alert("파일을 넣어주세요.");
      return;
    }

    const response = await axios.post(`http://localhost:8080/api/file-url`, {
      params: { fileName: file.name },
    });
    const presignedUrl = response.data.data.url;

    const result = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (result.status === 200) {
      console.log("File uploaded successfully!");
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

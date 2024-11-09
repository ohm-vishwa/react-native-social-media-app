import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";
import { supabaseUrl } from "../constants";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("../assets/images/defaultUser.png");
  }
};

export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const dawnloadFile = async (url) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilepath(url));
    return uri;
  } catch (error) {
    return null;
  }
};

export const getLocalFilepath = (filePath) => {
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });
    if (error) {
      // console.log("file upload error ", error);
      return { success: false, msg: "Could not upload media" };
    }

    // console.log("data => ", data);
    return { success: true, data: data.path };
  } catch (error) {
    // console.log("file upload error ", error);
    return { success: false, msg: "Could not upload media" };
  }
};

export const getFilePath = (folderName, isImage) => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  const randomString = Math.random().toString(36).substring(2, 10);

  // Build the final path
  return `/${folderName}/${formattedDate}-${randomString}${
    isImage ? ".png" : ".mp4"
  }`;
};

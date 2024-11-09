import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type === "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      // console.log("create post error : ", error);
      return { success: false, data: data };
    }
    return { success: true, data: data };
  } catch (error) {
    // console.log("createPost error: ", error);
    return { success: false, msg: "Could not create your post" };
  }
};

export const fetchPosts = async (limit = 10, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*,user:users (id,name,image),
      postLikes(*), comments(count)`
        )
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);
      if (error) {
        // console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch the post" };
      }
      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*,user:users (id,name,image),
      postLikes(*), comments(count)`
        )
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) {
        // console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch the post" };
      }
      return { success: true, data: data };
    }
  } catch (error) {
    // console.log("fetchPosts error: ", error);
    return { success: false, msg: "Could not fetch the post" };
  }
};

export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*,user:users (id,name,image),
        postLikes(*),
        comments(*,user:users(id,name,image))`
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      // console.log("fetchPostDetals error: ", error);
      return { success: false, msg: "Could not fetch the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    // console.log("fetchPostDetails error: ", error);
    return { success: false, msg: "Could not fetch the post" };
  }
};

export const creatPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      // console.log("postLike error: ", error);
      return { success: false, msg: "Could not like the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    // console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the post" };
  }
};

export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      // console.log("postLike error: ", error);
      return { success: false, msg: "Could not remove the post like" };
    }
    return { success: true };
  } catch (error) {
    // console.log("postLike error: ", error);
    return { success: false, msg: "Could not remove the post like" };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      // console.log("postLike error: ", error);
      return { success: false, msg: "Could not like the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    // console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the post" };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      // console.log("removeComment error: ", error);
      return { success: false, msg: "Could not remove comment" };
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    // console.log("removeComment error: ", error);
    return { success: false, msg: "Could not remove comment" };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      // console.log("removePost error: ", error);
      return { success: false, msg: "Could not remove post" };
    }
    return { success: true, data: { postId } };
  } catch (error) {
    // console.log("removePost error: ", error);
    return { success: false, msg: "Could not remove post" };
  }
};

export const fetchNotification = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(`*,sender:senderId(id, name, image)`)
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      // console.log("fetchNotifications error: ", error);
      return { success: false, msg: "Could not fetch notifications" };
    }
    return { success: true, data: data };
  } catch (error) {
    // console.log("fetchPNotifications error: ", error);
    return { success: false, msg: "Could not fetch notifications" };
  }
};
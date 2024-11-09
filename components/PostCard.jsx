import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "../constants/theme";
import { hp, stripHtmltags, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import Icon from "../assets/icons";
import RenderHTML from "react-native-render-html";
import { Image } from "expo-image";
import { dawnloadFile, getSupabaseFileUrl } from "../services/imageService";
import { Video } from "expo-av";
import { creatPostLike, removePostLike } from "../services/postService";
import { Share } from "react-native";
import Loading from "./Loading";
import { useAuth } from "../contexts/AuthContext";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};
const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const openPostDetails = () => {
    if (!showMoreIcon) {
      return null;
    }
    router.push({ pathname: "postDetails", params: { postId: item?.id } });
  };

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter((like) => {
        return user.id != like.userId;
      });

      setLikes([...updatedLikes]);
      // setLikes();
      let res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) {
        Alert.alert("post", "Something went wrong!");
      }
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await creatPostLike(data);
      if (!res.success) {
        Alert.alert("post", "Something went wrong!");
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmltags(item?.body) };
    if (item?.file) {
      setLoading(true);
      let url = await dawnloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url;
    }
    await Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure want to delete?", [
      {
        text: "Cancel",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  const createdAt = moment(item?.created_at).format("MMM D");

  // liked = false;
  const liked = likes.filter((like) => like?.userId == currentUser?.id)[0]
    ? true
    : false;

  const onViewProfile = () => {
    router.push({ pathname: "viewProfile", params: { userId: item.userId } });
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user info and post time */}
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={onViewProfile}>
            <Avatar
              size={hp(4.5)}
              uri={item?.user?.image}
              rounded={theme.radius.md}
            />
          </TouchableOpacity>
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        {showDelete && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* post body & media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
        {item?.file && item?.file.includes("postImages") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}

        {/* post videos */}
        {item?.file && item?.file.includes("postVideos") && (
          <Video
            style={[styles.postMedia, { height: hp(30) }]}
            source={getSupabaseFileUrl(item?.file)}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
      </View>

      {/* like, comment & share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              fill={liked ? theme.colors.rose : "transparent"}
              size={24}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text>{item?.comments[0]?.count}</Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.meduim,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.meduim,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    borderWidth: 0.5,
    borderColor: theme.colors.textLight,
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
  },

  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});

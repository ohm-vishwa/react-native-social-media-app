import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { getUserData } from "../../services/userServices";

let limit = 0;
// var userData;
const ViewProfile = () => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, sethasMore] = useState(true);
  const { userId } = useLocalSearchParams();

  const userfetch = async (userId) => {
    const res = await getUserData(userId);
    setUser(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    userfetch(userId);
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    let res = await fetchPosts(limit, userId);
    if (res.success) {
      if (posts?.length == res.data?.length) sethasMore(false);
      setPosts(res?.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <FlatList
        data={posts}
        ListHeaderComponent={<UserHeader user={user} router={router} />}
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        onEndReached={() => {
          getPosts();
        }}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text style={styles.noPost}>No more Posts</Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="profile" mb={30} />
      </View>
      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
          </View>
          {user?.address && (
            <View style={styles.info}>
              <Icon name="location" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{user && user?.address}</Text>
            </View>
          )}
          {/* bio*/}
          {user && user.bio && <Text style={styles.infoText}>{user?.bio}</Text>}
        </View>
      </View>
    </View>
  );
};

export default ViewProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 2,
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  editIcon: {
    justifyContent: "space-around",
    alignItems: "center",

    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: theme.fonts.meduim,
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.meduim,
    color: theme.colors.textLight,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});

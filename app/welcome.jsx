import { Image, StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";
import { StatusBar } from "expo-status-bar";
import welcomeImage from "../assets/images/welcome.png";
import { theme } from "../constants/theme.js";
import Button from "../components/Button.jsx";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* welcome Image */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={welcomeImage}
        />

        {/* title */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>LinkUp!</Text>
          <Text style={styles.punchline}>
            Where every thought finds a home and every image tells a story.
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("signUp")}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an Account!</Text>
            <Pressable onPress={() => router.push("login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.semiBold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-around",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(13),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});

import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/shared/Colors";

const LoadingDialog = ({ visible = false, text = "Loading..." }: any) => {
  return (
    <Modal transparent visible={visible} statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <View
          style={{
            padding: 20,
            borderRadius: 15,
            backgroundColor: Colors.primary,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={Colors.white} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000070",
  },
  text: {
    marginTop: 10,
    color: Colors.white,
    fontSize: 16,
    fontFamily: "outfit",
  },
});

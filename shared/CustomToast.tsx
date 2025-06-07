import Colors from "@/services/Colors";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CustomToastProps {
  text1?: string;
  text2?: string;
  props?: {
    icon?: string;
    image?: ImageSourcePropType;
  };
}

const CustomToast: React.FC<CustomToastProps> = ({ text1, text2, props }) => {
  return (
    <View style={styles.container}>
      {props?.image ? (
        <Image source={props.image} style={styles.image} resizeMode="contain" />
      ) : (
        <Text style={styles.icon}>{props?.icon || "🔔"}</Text>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.subtitle}>{text2}</Text>}
      </View>
    </View>
  );
};

export default CustomToast;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 40,
  },
  icon: {
    fontSize: 22,
    marginRight: 12,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.WHITE,
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: Colors.WHITE,
    fontSize: 14,
    marginTop: 2,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EmptyFeedStateProps {
  message: string;
}

export const EmptyFeedState: React.FC<EmptyFeedStateProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  icon: {
    fontSize: 48,
  },
  messageText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HeaderViewModel } from "../src/daily-feed-presenter.js";

interface MascotHeaderProps {
  header: HeaderViewModel;
}

const mascotEmotions: Record<string, string> = {
  idle: "🦉",
  happy: "😃",
  cheering: "🎉",
  thinking: "🤔",
  sleepy: "😴",
};

export const MascotHeader: React.FC<MascotHeaderProps> = ({ header }) => {
  const xpMax = header.level * 100;
  const xpPercent = Math.min(100, Math.floor((header.xp / xpMax) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarEmoji}>
          {mascotEmotions[header.emotion] || "🦉"}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>
            Nível {header.level} ({header.xp}/{xpMax} XP)
          </Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {header.streak}</Text>
          </View>
        </View>
        <Text style={styles.greetingText}>{header.greetingText}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${xpPercent}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#334155",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelText: {
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  streakBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  streakText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "800",
  },
  greetingText: {
    color: "#e2e8f0",
    fontSize: 13,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#1e293b",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 3,
  },
});

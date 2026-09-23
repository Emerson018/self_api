import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { HybridCardViewModel } from "../src/daily-feed-presenter.js";

interface HybridProviderCardProps {
  card: HybridCardViewModel;
  onComplete: (id: string) => void;
}

export const HybridProviderCard: React.FC<HybridProviderCardProps> = ({
  card,
  onComplete,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onComplete(card.id)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: card.brandColor }]}>
          <Text style={styles.badgeText}>{card.badgeText}</Text>
        </View>
        <Text style={styles.timeText}>{card.formattedTime}</Text>
      </View>

      <Text style={styles.titleText}>{card.title}</Text>
      {card.subtitle ? (
        <Text style={styles.subtitleText}>{card.subtitle}</Text>
      ) : null}

      <Text style={styles.actionHint}>👉 Clique para concluir (+15 XP)</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  timeText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  titleText: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
  },
  subtitleText: {
    color: "#94a3b8",
    fontSize: 12,
  },
  actionHint: {
    color: "#3b82f6",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 4,
  },
});

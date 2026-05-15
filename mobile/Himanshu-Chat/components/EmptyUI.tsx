import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View, StyleSheet } from "react-native";

type EmptyUIProps = {
  title: string;
  subtitle?: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  iconSize?: number;
  buttonLabel?: string;
  onPressButton?: () => void;
};

function EmptyUI({
  title,
  subtitle,
  iconName = "chatbubbles-outline",
  iconColor = "#6B6B70",
  iconSize = 64,
  buttonLabel,
  onPressButton,
}: EmptyUIProps) {
  return (
    <View style={styles.container}>
      {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} />}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {buttonLabel && onPressButton ? (
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={onPressButton}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  title: {
    color: '#8E8E93', // text-muted-foreground
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  subtitle: {
    color: '#6B6B70', // text-subtle-foreground
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#F4A261', // bg-primary
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#0D0D0F', // text-surface-dark
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EmptyUI;
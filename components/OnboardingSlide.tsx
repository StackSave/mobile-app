import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface OnboardingSlideProps {
  emoji: string;
  title: string;
  description: string;
  bulletPoints?: string[];
}

export default function OnboardingSlide({
  emoji,
  title,
  description,
  bulletPoints,
}: OnboardingSlideProps) {
  return (
    <View style={styles.slide}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text variant="headlineMedium" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.description}>
        {description}
      </Text>
      {bulletPoints && bulletPoints.length > 0 && (
        <View style={styles.bulletContainer}>
          {bulletPoints.map((point, index) => (
            <Text key={index} variant="bodyMedium" style={styles.bulletPoint}>
              • {point}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletContainer: {
    width: '100%',
    marginTop: 16,
  },
  bulletPoint: {
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'left',
  },
});

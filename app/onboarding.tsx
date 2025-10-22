import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import OnboardingSlide from '../components/OnboardingSlide';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🪙',
    title: 'Welcome to StackSave',
    description: 'Save, grow, and earn — one day at a time.\n\nStackSave turns your crypto savings into daily progress, just like learning on Duolingo — but for your wealth.',
  },
  {
    emoji: '⚖️',
    title: 'Smart Saving Modes',
    description: 'Choose your growth path:',
    bulletPoints: [
      'Lite Mode → We handle everything for you. Your funds go into low-risk, stablecoin pools with steady daily growth.',
      'Pro Mode → You take control. Adjust your risk and pick your own staking strategy.',
    ],
  },
  {
    emoji: '💰',
    title: 'Set Your Goals',
    description: 'Want to buy a new phone? Fund your next trip? Or stack long-term wealth?\n\nStackSave helps you set clear saving goals and tracks your daily streak — encouraging you to save consistently.',
  },
  {
    emoji: '🧠',
    title: 'Risk Managed, Always',
    description: 'Behind the scenes, StackSave automatically finds the best daily APY across trusted DeFi protocols.\n\nIt rebalances to minimize risk and keeps your portfolio safe while you focus on staying consistent.',
    bulletPoints: [
      'Lite Mode: 0.02–0.05%/day (~7–15% APY)',
      'Balanced Mode: 0.05–0.15%/day (~15–40% APY)',
      'Pro Mode: Up to 0.3%/day — higher yield, higher risk',
    ],
  },
  {
    emoji: '🔥',
    title: 'Your Daily Save Challenge',
    description: 'Each day you save, your streak grows.\n\nMiss a day? Your streak breaks — so stay consistent and level up your savings habits!',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      // Last slide, go to wallet connection
      router.push('/connect-wallet');
    }
  };

  const handleSkip = () => {
    router.push('/connect-wallet');
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={[styles.slideContainer, { width }]}>
            <OnboardingSlide {...slide} />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Next/Continue Button */}
      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        {currentSlide === SLIDES.length - 1 ? 'Continue' : 'Next'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#000000',
    width: 24,
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

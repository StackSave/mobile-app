import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function BlockchainCube() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Create 9 animated values for grid squares
  const gridSquareAnims = useRef(
    [...Array(9)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000, // 20 seconds for full rotation
        useNativeDriver: true,
      })
    ).start();

    // Staggered pulsing animation for grid squares
    const animations = gridSquareAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            delay: i * 100, // Stagger by 100ms
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      )
    );

    // Start all animations
    animations.forEach((anim) => anim.start());
  }, [rotateAnim, gridSquareAnims]);

  const rotateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateX = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '15deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.cube,
          {
            transform: [
              { perspective: 1000 },
              { rotateY },
              { rotateX },
            ],
          },
        ]}
      >
        {/* Main Cube Face with Animated Grid */}
        <View style={styles.cubeFace}>
          <View style={styles.grid}>
            {gridSquareAnims.map((anim, i) => {
              const scale = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              });

              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.gridSquare,
                    {
                      transform: [{ scale }],
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* 3D Depth Layers */}
        <View style={[styles.depthLayer, styles.layer1]} />
        <View style={[styles.depthLayer, styles.layer2]} />
      </Animated.View>
    </View>
  );
}

const CUBE_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    width: CUBE_SIZE,
    height: CUBE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cube: {
    width: CUBE_SIZE,
    height: CUBE_SIZE,
    position: 'relative',
  },
  cubeFace: {
    width: CUBE_SIZE,
    height: CUBE_SIZE,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    position: 'absolute',
    zIndex: 3,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 3,
    justifyContent: 'space-between',
  },
  gridSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  depthLayer: {
    position: 'absolute',
    width: CUBE_SIZE,
    height: CUBE_SIZE,
    borderWidth: 2,
    borderColor: '#000000',
  },
  layer1: {
    backgroundColor: '#F3F4F6',
    top: 3,
    left: 3,
    zIndex: 2,
  },
  layer2: {
    backgroundColor: '#E5E7EB',
    top: 6,
    left: 6,
    zIndex: 1,
  },
});

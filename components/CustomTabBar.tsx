import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window');

interface TabConfig {
  name: string;
  icon: string;
}

const tabConfigs: TabConfig[] = [
  { name: 'HomeTab', icon: 'home' },
  { name: 'JobsTab', icon: 'clipboard-list' },
  { name: 'MessagesTab', icon: 'email' },
  { name: 'ProfileTab', icon: 'cog' },
];

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Calculate tab width and position
  const tabBarWidth = screenWidth * 0.65; // Reduced from 0.9 to 0.8
  const tabWidth = tabBarWidth / tabConfigs.length;
  const circleSize = 40; // Reduced from 50 to 40

  useEffect(() => {
    // Animate to the active tab position
    const activeIndex = state.index;
    const targetPosition = activeIndex * tabWidth + (tabWidth - circleSize) / 1.43;

    Animated.spring(animatedValue, {
      toValue: targetPosition,
      useNativeDriver: false,
      tension: 90,
      friction: 18,
    }).start();
  }, [state.index, tabWidth, animatedValue]);

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { width: tabBarWidth }]}>
        {/* Animated white circle background */}
        <Animated.View
          style={[
            styles.activeBackground,
            {
              left: animatedValue,
              width: circleSize,
              height: circleSize,
            },
          ]}
        />

        {/* Tab buttons */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tabConfig = tabConfigs.find(config => config.name === route.name);

          if (!tabConfig) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, { width: tabWidth }]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tabConfig.icon as any}
                size={22}
                color={isFocused ? '#6366F1' : '#FFFFFF'}
                style={[
                  styles.icon,
                  tabConfig.icon === 'cog' && styles.cogIcon // Add special styling for cog icon
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    height: 60, // Reduced from 70 to 60
    backgroundColor: '#6366F1',
    borderRadius: 30, // Half of height for full pill shape
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 5, // Keep left padding at 8px
    paddingRight: 11, // Increase right padding by ~3px (approximately 1mm)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
      ,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  activeBackground: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Half of circle size (40/2)
    top: 10, // Center vertically in the 60px height
  },
  tab: {
    height: 60, // Reduced from 70 to 60
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure icons are above the white circle
  },
  icon: {
    zIndex: 3, // Ensure icons are on top
  },
  cogIcon: {
    marginLeft: -3, // Move cog icon approximately 1mm to the left
  },
});

export default CustomTabBar;
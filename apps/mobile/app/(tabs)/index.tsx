import { StyleSheet, TouchableOpacity  } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MoonView } from '@/components/MoonView';
import { getMoonPhase } from  "@selene/astronomy";
import * as Location from 'expo-location';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Colors } from '@repo/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabOneScreen() {
  const [phase, setPhase] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const accentColorWithOpacity = Colors.brand.dark2;
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    // We calculate the initial phase based on the current date
    setPhase(getMoonPhase(new Date()));
  }, []);

  const updateLocationAndPhase = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permiso de GPS denegado.');
        setPhase(getMoonPhase(new Date()));
        return;
      }

      // Capture native coordinates for precision calculations in Selene
      const location = await Location.getCurrentPositionAsync({});
      const currentPhase = getMoonPhase(new Date()); 
      setPhase(currentPhase);
      setLocationError(null);
    } catch (error) {
      console.error(error);
      setPhase(getMoonPhase(new Date()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
        colors={[Colors.brand.dark1, Colors.brand.dark2]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1.5 }}
        style={styles.gradient}
      >
    <View style={[styles.cardContainer]}>
      
      <Text style={styles.title}>FASE LUNAR</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <MoonView phase={phase} animated={isAnimating} />
      
    </View>
    <TouchableOpacity 
        style={styles.button} 
        onPress={() => setIsAnimating(!isAnimating)}
      >
        <Text style={styles.buttonText}>
          {isAnimating ? "Detener Animación" : "Animar Ciclo Completo"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  gradient: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },
});

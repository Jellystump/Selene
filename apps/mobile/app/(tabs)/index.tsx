import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MoonView } from '@/components/MoonView';
import { getMoonPhase, getMoonIllumination } from  "@selene/astronomy";
import * as Location from 'expo-location';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Colors } from '@repo/ui';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabOneScreen() {
  const [phase, setPhase] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const accentColorWithOpacity = Colors.brand.dark2;
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [phaseName, setPhaseName] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
  const currentPhase = getMoonPhase(new Date());
  setPhase(currentPhase);
  setPercentage(getMoonIllumination(new Date()));
  let name = '';

  if (currentPhase >= 358 || currentPhase < 2) {
    name = 'New moon';
  } else if (currentPhase >= 2 && currentPhase < 88) {
    name = 'Waxing crescent'; 
  } else if (currentPhase >= 88 && currentPhase <= 92) {
    name = 'First quarter';   
  } else if (currentPhase >= 92 && currentPhase < 178) {
    name = 'Waxing gibbous';  
  } else if (currentPhase >= 178 && currentPhase <= 182) {
    name = 'Full moon';      
  } else if (currentPhase > 182 && currentPhase < 268) {
    name = 'Waning gibbous'; 
  } else if (currentPhase >= 268 && currentPhase <= 272) {
    name = 'Third quarter';   
  } else {
    name = 'Waning crescent'; 
  }

  setPhaseName(name);
  
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
      /* colors={[Colors.brand.light1, Colors.brand.light2]} */
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1.5 }}
      style={styles.gradient}
    >
      <View style={[styles.cardContainer]}>
        <View style={[styles.cardContainerMoonView]}>
          <MoonView phase={phase} animated={isAnimating} />
        </View>
        

        <View style={[styles.cardContainerTextView]}>
          <Text style={[styles.title]}>{phaseName}</Text>
          <LinearGradient
            colors={['transparent', Colors.brand.gray, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} 
            style={styles.gradientSeparator}
          />
          <Text style={styles.percentageText}>
            {percentage}%
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setIsAnimating(!isAnimating)}
      >
        <Text style={styles.title}>
          {isAnimating ? "Detener Animación" : "Animar Ciclo Completo"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.brand.light2,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: '80%',
  },
  gradient: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: 'rgba(7, 23, 51, 0.51)', 
    borderRadius: 25,
    marginVertical: 50,
    marginHorizontal: 15,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center', 
  },
  cardContainerMoonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainerTextView: {
    flex: 1.25, 
    alignItems: 'center', 
    justifyContent: 'center',
    
    paddingLeft: 10,
  },
  gradientSeparator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  percentageText: {
    color: '#999999',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1
  }
});

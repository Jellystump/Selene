import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@repo/ui';
import { useColorScheme } from 'react-native';

interface SelHeaderTextProps {
  children: React.ReactNode;
}

export function   SelHeaderText({ children }: SelHeaderTextProps) {
  const styles = useStyles();
  
  return (
    <View style={[{alignItems: 'center'}]}>
      <Text style={styles.title}>{children}</Text>
    </View>
  );
};

function useStyles() {
  const colorScheme = useColorScheme();

  return StyleSheet.create({
    title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? Colors.brand.superLightBlue : Colors.brand.lightBlue,
  },
  })
};

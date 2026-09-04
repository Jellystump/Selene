import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Colors } from '@repo/ui';

/*LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';
*/
LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

export function AstroCalendar() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Datos de ejemplo indexados (Aquí mapearías los cálculos de astronomy-engine)
  const [events, setEvents] = useState({
    '2026-06-25': { marked: true, dotColor: '#d0e0ff', description: 'Luna Llena en Capricornio' },
    '2026-07-03': { marked: true, dotColor: '#38bdf8', description: 'Eclipse Lunar Penumbral' },
    '2026-07-12': { marked: true, dotColor: '#f59e0b', description: 'Lluvia de Estrellas Delta Acuáridas' },
  });

  // Combinar el día seleccionado por el usuario con los eventos existentes
  const getMarkedDates = () => {
    const marked: any = { ...events };
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: 'rgba(208, 224, 255, 0.2)', // Círculo translúcido suave
        selectedTextColor: '#fff',
      };
    }
    return marked;
  };

  return (
    <View style={styles.container}>
      <Calendar
        // Pasar las fechas marcadas con eventos
        markedDates={getMarkedDates()}
        
        // Manejar clicks en los días
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        
        // Estilos del tema (Fondo oscuro profundo y textos azul claro/blanco)
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#868686',
          selectedDayBackgroundColor: '#d0e0ff',
          selectedDayTextColor: '#000',
          todayTextColor: '#38bdf8', // Color para el día de hoy
          dayTextColor: '#ffffff',
          textDisabledColor: 'rgba(255, 255, 255, 0.15)',
          dotColor: '#38bdf8',
          selectedDotColor: '#000000',
          arrowColor: '#d0e0ff', // Flechas de navegación de meses
          monthTextColor: '#d0e0ff', // Color del título del mes
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 15,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 13,
        }}
      />

      {/* Mostrar descripción del evento seleccionado abajo */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          {selectedDate ? `Fecha: ${selectedDate}` : 'Select a date'}
        </Text>
        <Text style={styles.infoText}>
          {events[selectedDate as keyof typeof events]?.description || "There's no relevant astronomical events."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    backgroundColor: 'transparent',
  },
  infoBox: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoTitle: {
    color: '#868686',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
});
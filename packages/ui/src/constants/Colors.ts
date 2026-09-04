const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  brand: {
    /* ==============================
              BACKGROUND
    ============================== */ 
    dark1: '#03080e',
    dark2: '#00162b',
    light1: '#ffffff',
    light2: '#e0e0e0',
    cardLightBg: 'rgba(84, 112, 153, 0.44)',
    cardDarkBg: 'rgba(22, 31, 48, 0.44)',

    /* ==============================
                  TEXT
    ============================== */    
    superLightBlue: '#aaecfa', 
    lightBlue: '#47abf2', 
    darkBlue: '#434ed3', 
    pcLight: '#b3b3b3',
    pcDark: '#4e4e4e',         
    surface: '#0a0a0ade',  
  },
  status: {
    error: '#ff9800',
    success: '#4caf50',
  }
};
export default Colors;

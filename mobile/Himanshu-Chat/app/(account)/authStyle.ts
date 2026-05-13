
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      justifyContent: 'center',
    },
    header: {
      // marginBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 10,
    },
    countryCode: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRightWidth: 1,
      borderRightColor: '#E0E0E0',
    },
    countryCodeText: {
      fontSize: 16,
      color: '#000',
    },
    input: {
      flex: 1,
      height: 50,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#000',
    },
    button: {
      flexDirection: 'row',
      backgroundColor: '#075E54',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      marginBottom: 10,
    },
    buttonDisabled: {
      backgroundColor: '#A8D08D',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
    },
    terms: {
      marginTop: 30,
      alignItems: 'center',
    },
    termsText: {
      fontSize: 12,
      color: '#999',
      textAlign: 'center',
    },
    termsLink: {
      color: '#075E54',
    },
  });
  export default styles
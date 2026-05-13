// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// import { useRouter, useLocalSearchParams } from "expo-router";
// const OTPScreen = () => {
//     const navigation = useRouter()
//   const { phoneNumber } = useLocalSearchParams();
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const inputs = useRef([]);

//   const handleOtpChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 5) {
//       inputs.current[index + 1].focus();
//     }

//     if (index === 5 && text) {
//       handleVerify();
//     }
//   };

//   const handleVerify = () => {
//     const otpString = otp.join('');
//     if (otpString.length === 6) {
//       navigation.navigate('ProfileSetup');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.backButton}
//       >
//         <Text style={styles.backText}>← Back</Text>
//       </TouchableOpacity>

//       <View style={styles.header}>
//         <Text style={styles.title}>Verify OTP</Text>
//         <Text style={styles.subtitle}>
//           Enter the 6-digit code sent to {phoneNumber}
//         </Text>
//       </View>

//       <View style={styles.otpContainer}>
//         {otp.map((digit, index) => (
//           <TextInput
//             key={index}
//             ref={(ref) => (inputs.current[index] = ref)}
//             style={[
//               styles.otpInput,
//               digit && styles.otpInputFilled,
//             ]}
//             value={digit}
//             onChangeText={(text) => handleOtpChange(text, index)}
//             keyboardType="numeric"
//             maxLength={1}
//             selectTextOnFocus
//           />
//         ))}
//       </View>

//       <View style={styles.resendContainer}>
//         <Text style={styles.resendText}>Didn't receive code? </Text>
//         <TouchableOpacity>
//           <Text style={styles.resendLink}>Resend (30s)</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   backButton: {
//     marginBottom: 30,
//     marginTop: 20,
//   },
//   backText: {
//     fontSize: 16,
//     color: '#075E54',
//   },
//   header: {
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//   },
//   otpInput: {
//     width: 50,
//     height: 50,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     borderRadius: 10,
//     fontSize: 20,
//     textAlign: 'center',
//     color: '#000',
//   },
//   otpInputFilled: {
//     borderColor: '#075E54',
//   },
//   resendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   resendText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   resendLink: {
//     fontSize: 14,
//     color: '#075E54',
//     fontWeight: 'bold',
//   },
// });

// export default OTPScreen;

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OTP = () => {
  return (
    <View>
      <Text>OTP</Text>
    </View>
  )
}

export default OTP

const styles = StyleSheet.create({})
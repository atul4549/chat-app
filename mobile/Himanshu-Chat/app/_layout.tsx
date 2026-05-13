import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
// rnfes
// rnss

// import { Redirect, Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// // import { useAuth } from "@clerk/clerk-expo";
// // import { whatsappDarkTheme } from '../theme';
// // import useAuthStore from "../store/useAuthStore";
// const TabsLayout = () => {
//   // const { isSignedIn, isLoaded } = useAuthStore();

//   // if (!isLoaded) return null;
//   // if (!isSignedIn) return <Redirect href={"/(auth)/LoginScreen"} />;

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           // backgroundColor: whatsappDarkTheme.background,
//           // borderTopColor: "#1A1A1D",
//           borderTopColor: "#005c4b",
//           borderTopWidth: 1,
//           height: 88,
//           paddingTop: 8,
//         },
//         // tabBarActiveTintColor: whatsappDarkTheme.secondary,
//         // tabBarInactiveTintColor: whatsappDarkTheme.icon,
//         tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
//       }}
//     >
//       <Tabs.Screen
//         name="(messaging)/chatList"
//         options={{
//           title: "Chats",
//           tabBarIcon: ({ color, focused, size }) => (
//             <Ionicons
//               name={focused ? "chatbubbles" : "chatbubbles-outline"}
//               size={size}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="(account)/ProfileSetup"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ color, focused, size }) => (
//             <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// };

// export default TabsLayout;

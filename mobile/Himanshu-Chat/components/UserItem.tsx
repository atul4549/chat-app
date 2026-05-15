// import type { User } from "@/types";
// import { Image } from "expo-image";
// import { Pressable, Text, View, StyleSheet } from "react-native";

// type UserItemProps = {
//   user: User;
//   isOnline: boolean;
//   onPress: () => void;
// };

// function UserItem({ user, isOnline, onPress }: UserItemProps) {
//   return (
//     <Pressable 
//       style={({ pressed }) => [
//         styles.container,
//         pressed && styles.containerPressed
//       ]} 
//       onPress={onPress}
//     >
//       <View style={styles.avatarContainer}>
//         <Image 
//           source={{ uri: user.avatar }} 
//           style={styles.avatar} 
//         />
//         {isOnline && (
//           <View style={styles.onlineIndicator} />
//         )}
//       </View>

//       <View style={styles.userInfoContainer}>
//         <View style={styles.headerRow}>
//           <Text style={styles.userName} numberOfLines={1}>
//             {user.name}
//           </Text>
//           {isOnline && <Text style={styles.onlineText}>Online</Text>}
//         </View>
//         <Text style={styles.userEmail}>{user.email}</Text>
//       </View>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10, // py-2.5 = 10px
//     paddingHorizontal: 16,
//   },
//   containerPressed: {
//     opacity: 0.7,
//   },
  
//   // Avatar Section
//   avatarContainer: {
//     position: 'relative',
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 999,
//   },
//   onlineIndicator: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 14, // w-3.5 = 14px
//     height: 14, // h-3.5 = 14px
//     backgroundColor: '#34C759', // bg-green-500
//     borderRadius: 7, // rounded-full
//     borderWidth: 2,
//     borderColor: '#1C1C1E', // border-surface
//   },
  
//   // User Info Section
//   userInfoContainer: {
//     flex: 1,
//     marginLeft: 12, // ml-3 = 12px
//     borderBottomWidth: 1,
//     borderBottomColor: '#2C2C2E', // border-surface-light
//     paddingBottom: 8, // pb-2 = 8px
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   userName: {
//     color: '#FFFFFF', // text-foreground
//     fontWeight: '500', // font-medium
//     fontSize: 16,
//     flex: 1,
//     marginRight: 8,
//   },
//   onlineText: {
//     color: '#F4A261', // text-primary
//     fontSize: 12, // text-xs
//     fontWeight: '500', // font-medium
//   },
//   userEmail: {
//     color: '#6B6B70', // text-subtle-foreground
//     fontSize: 12, // text-xs
//     marginTop: 2, // mt-0.5 = 2px
//   },
// });

// export default UserItem;


import type { User } from "@/types";
import { Image } from "expo-image";
import { Pressable, Text, View, StyleSheet } from "react-native";

type UserItemProps = {
  user: User;
  isOnline: boolean;
  isTyping?: boolean;
  onPress: () => void;
};

function UserItem({ user, isOnline, isTyping = false, onPress }: UserItemProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar} 
        />
        {isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>

      <View style={styles.userInfoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name}
          </Text>
          <View style={styles.statusContainer}>
            {isTyping ? (
              <Text style={styles.typingText}>Typing...</Text>
            ) : isOnline ? (
              <Text style={styles.onlineText}>Online</Text>
            ) : null}
          </View>
        </View>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user.email}
        </Text>
        {isTyping && (
          <View style={styles.typingDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotDelay]} />
            <View style={[styles.dot, styles.dotDelay2]} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',
  },
  containerPressed: {
    opacity: 0.7,
  },
  
  // Avatar Section
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    backgroundColor: '#34C759',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  
  // User Info Section
  userInfoContainer: {
    flex: 1,
    marginLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineText: {
    color: '#F4A261',
    fontSize: 12,
    fontWeight: '500',
  },
  typingText: {
    color: '#F4A261',
    fontSize: 12,
    fontStyle: 'italic',
  },
  userEmail: {
    color: '#6B6B70',
    fontSize: 12,
    marginTop: 2,
  },
  
  // Typing Animation Dots
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F4A261',
    marginRight: 3,
    opacity: 0.4,
  },
  dotDelay: {
    opacity: 0.6,
  },
  dotDelay2: {
    opacity: 1,
  },
});

export default UserItem;
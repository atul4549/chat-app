// import { Message } from "../types";
// import { View, Text, StyleSheet } from "react-native";

// function MessageBubble({ message, isFromMe }: { message: Message; isFromMe: boolean }) {
//   return (
//     <View style={[
//       styles.container,
//       isFromMe ? styles.containerFromMe : styles.containerFromOther
//     ]}>
//       <View style={[
//         styles.bubble,
//         isFromMe ? styles.bubbleFromMe : styles.bubbleFromOther
//       ]}>
//         <Text style={[
//           styles.messageText,
//           isFromMe ? styles.messageTextFromMe : styles.messageTextFromOther
//         ]}>
//           {message.text}
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     marginVertical: 4,
//   },
//   containerFromMe: {
//     justifyContent: 'flex-end',
//   },
//   containerFromOther: {
//     justifyContent: 'flex-start',
//   },
//   bubble: {
//     maxWidth: '80%',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 16,
//   },
//   bubbleFromMe: {
//     backgroundColor: '#F4A261', // bg-primary
//     borderBottomRightRadius: 4, // rounded-br-sm
//   },
//   bubbleFromOther: {
//     backgroundColor: '#2C2C2E', // bg-surface-card
//     borderRadius: 16,
//     borderBottomLeftRadius: 4, // rounded-bl-sm
//     borderWidth: 1,
//     borderColor: '#3A3A3C', // border-surface-light
//   },
//   messageText: {
//     fontSize: 14,
//   },
//   messageTextFromMe: {
//     color: '#0D0D0F', // text-surface-dark
//   },
//   messageTextFromOther: {
//     color: '#FFFFFF', // text-foreground
//   },
// });

// export default MessageBubble;



import { Message } from "../types";
import { View, Text, StyleSheet } from "react-native";
// import { formatDistanceToNow } from "date-fns";

function MessageBubble({ message, isFromMe }: { message: Message; isFromMe: boolean }) {
  return (
    <View style={[
      styles.container,
      isFromMe ? styles.containerFromMe : styles.containerFromOther
    ]}>
      <View style={[
        styles.bubble,
        isFromMe ? styles.bubbleFromMe : styles.bubbleFromOther
      ]}>
        <Text style={[
          styles.messageText,
          isFromMe ? styles.messageTextFromMe : styles.messageTextFromOther
        ]}>
          {message.text}
        </Text>
        {message.createdAt && (
          <Text style={[
            styles.timestamp,
            isFromMe ? styles.timestampFromMe : styles.timestampFromOther
          ]}>
            {/* {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })} */}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  containerFromMe: {
    justifyContent: 'flex-end',
  },
  containerFromOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bubbleFromMe: {
    backgroundColor: '#F4A261', // bg-primary
    borderBottomRightRadius: 4, // rounded-br-sm
  },
  bubbleFromOther: {
    backgroundColor: '#2C2C2E', // bg-surface-card
    borderBottomLeftRadius: 4, // rounded-bl-sm
    borderWidth: 1,
    borderColor: '#3A3A3C', // border-surface-light
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextFromMe: {
    color: '#0D0D0F', // text-surface-dark
  },
  messageTextFromOther: {
    color: '#FFFFFF', // text-foreground
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampFromMe: {
    color: '#0D0D0F',
    opacity: 0.7,
  },
  timestampFromOther: {
    color: '#8E8E93',
  },
});

export default MessageBubble;
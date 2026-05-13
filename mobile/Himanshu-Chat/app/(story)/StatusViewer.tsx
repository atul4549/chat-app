import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './StatusViewerStyle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import {useRouter, useLocalSearchParams} from 'expo-router'
const StatusViewer = () => {
  const navigation = useRouter()
  const { userId, statuses, userName } = useLocalSearchParams();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [showReactions, setShowReactions] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [views, setViews] = useState([
    { id: '1', name: 'Alice Johnson', avatar: null, time: '1m ago' },
    { id: '2', name: 'Bob Smith', avatar: null, time: '5m ago' },
    { id: '3', name: 'Carol Williams', avatar: null, time: '10m ago' },
    { id: '4', name: 'David Brown', avatar: null, time: '15m ago' },
    { id: '5', name: 'Eva Martinez', avatar: null, time: '20m ago' },
  ]);
  const [showViewsModal, setShowViewsModal] = useState(false);

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const currentStatus = statuses[currentIndex];
  const isMyStatus = userId === 'me';
  const STATUS_DURATION = 5000; // 5 seconds per status

  useEffect(() => {
    startProgress();
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPaused]);

  const startProgress = () => {
    progressAnimation.setValue(0);
    
    if (!isPaused) {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: STATUS_DURATION,
        useNativeDriver: false,
      }).start(() => {
        handleNext();
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      // Animate to next status
      Animated.sequence([
        Animated.timing(slideAnimation, {
          toValue: -SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex + 1);
        slideAnimation.setValue(SCREEN_WIDTH);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // All statuses viewed
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      Animated.sequence([
        Animated.timing(slideAnimation, {
          toValue: SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex - 1);
        slideAnimation.setValue(-SCREEN_WIDTH);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleClose = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.back();
    });
  };

  const handleScreenPress = (event) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;

    if (locationX < screenWidth / 3) {
      handlePrevious();
    } else if (locationX > (screenWidth * 2) / 3) {
      handleNext();
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleLongPress = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handleReaction = (emoji) => {
    console.log('Reacted with:', emoji);
    setShowReactions(false);
    // In real app, send reaction to server
  };

  const handleReply = () => {
    if (replyText.trim()) {
      console.log('Reply:', replyText);
      // In real app, send reply to status owner
      setReplyText('');
      Alert.alert('Reply Sent', 'Your reply has been sent');
    }
  };

  const handleViewViews = () => {
    setShowViewsModal(true);
  };

  const renderProgressBars = () => (
    <View style={styles.progressContainer}>
      {/* {statuses?.map((_, index) => (
        <View key={index} style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: index === currentIndex
                  ? progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  : index < currentIndex
                  ? '100%'
                  : '0%',
              },
            ]}
          />
        </View>
      ))} */}
    </View>
  );

  const renderTextStatus = (status) => (
    <View style={[styles.textStatusContainer, { backgroundColor: status.backgroundColor }]}>
      <Text style={[styles.textStatusContent, { color: status.textColor }]}>
        {status.caption}
      </Text>
    </View>
  );

  const renderPhotoStatus = (status) => (
    <View style={styles.photoStatusContainer}>
      {status.image ? (
        <Image source={{ uri: status.image }} style={styles.photoStatusImage} resizeMode="cover" />
      ) : (
        <View style={[styles.photoPlaceholder, { backgroundColor: '#E0E0E0' }]}>
          <Icon name="image-outline" size={80} color="#999" />
        </View>
      )}
      {status.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{status.caption}</Text>
        </View>
      )}
    </View>
  );

  const renderReactionsModal = () => (
    <Animated.View style={styles.reactionsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['❤️', '😮', '😂', '😢', '😡', '👍', '👏', '🎉', '💯', '🙏'].map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={styles.reactionEmoji}
            onPress={() => handleReaction(emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderViewsModal = () => (
    <Modal
      visible={showViewsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowViewsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.viewsModal}>
          <View style={styles.viewsHeader}>
            <Text style={styles.viewsTitle}>
              Viewed by {views.length} people
            </Text>
            <TouchableOpacity onPress={() => setShowViewsModal(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={views}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.viewItem}>
                <View style={styles.viewAvatar}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.viewAvatarImage} />
                  ) : (
                    <Text style={styles.viewAvatarText}>{item.name.charAt(0)}</Text>
                  )}
                </View>
                <Text style={styles.viewName}>{item.name}</Text>
                <Text style={styles.viewTime}>{item.time}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Progress Bars */}
      {renderProgressBars()}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>
                {userName.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.headerName}>{userName}</Text>
              <Text style={styles.headerTime}>
                {currentStatus?.createdAt
                  ? formatTime(currentStatus.createdAt)
                  : 'Recently'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // Show menu options
          }}
        >
          <Icon name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Status Content */}
      <TouchableOpacity
        style={styles.statusContent}
        onPress={handleScreenPress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.statusSlide,
            { transform: [{ translateX: slideAnimation }] },
          ]}
        >
          {currentStatus?.type === 'text'
            ? renderTextStatus(currentStatus)
            : renderPhotoStatus(currentStatus)}
        </Animated.View>
      </TouchableOpacity>

      {/* Pause Indicator */}
      {isPaused && (
        <View style={styles.pauseIndicator}>
          <Icon name="pause-circle" size={60} color="rgba(255,255,255,0.6)" />
        </View>
      )}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {/* Reply Section */}
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Reply..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity
            style={[styles.replyButton, !replyText.trim() && styles.replyButtonDisabled]}
            onPress={handleReply}
            disabled={!replyText.trim()}
          >
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!isMyStatus && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowReactions(!showReactions)}
              >
                <Icon name="happy-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="arrow-redo-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleViewViews}
              >
                <Icon name="eye-outline" size={24} color="#fff" />
                <Text style={styles.viewCount}>{views.length}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="flag-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reactions Picker */}
      {showReactions && renderReactionsModal()}

      {/* Views Modal */}
      {renderViewsModal()}

      {/* Quick Emoji Reactions */}
      {!isMyStatus && !showReactions && (
        <View style={styles.quickReactions}>
          {['❤️', '😮', '😂', '😢', '👍'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={styles.quickReactionButton}
              onPress={() => handleReaction(emoji)}
            >
              <Text style={styles.quickEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const formatTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};


export default StatusViewer;
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {styles} from './CreateStatusStyle';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useRouter, useLocalSearchParams } from "expo-router";
const CreateStatus = () => {
  const navigation = useRouter()
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [statusType, setStatusType] = useState('text'); // 'text', 'photo', 'video'
  const [backgroundColor, setBackgroundColor] = useState('#075E54');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(24);
  const [fontStyle, setFontStyle] = useState('regular'); // 'regular', 'bold', 'italic'
  const [privacy, setPrivacy] = useState('contacts'); // 'contacts', 'selected', 'only_me'
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [duration, setDuration] = useState(24); // hours
  
  const captionInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const backgroundColors = [
    '#075E54', '#128C7E', '#25D366', '#DCF8C6',
    '#34B7F1', '#FF6B6B', '#FFD93D', '#6C5CE7',
    '#A8E6CF', '#FF8B94', '#B8A9C9', '#FFB347',
    '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE',
  ];

  const textColors = ['#FFFFFF', '#000000', '#075E54', '#FF6B6B', '#34B7F1'];

  const fontStyles = [
    { id: 'regular', label: 'Regular', fontFamily: 'System' },
    { id: 'bold', label: 'Bold', fontFamily: 'System' },
    { id: 'italic', label: 'Italic', fontFamily: 'System' },
  ];

  const privacyOptions = [
    {
      id: 'contacts',
      label: 'My Contacts',
      icon: 'people-outline',
      description: 'All contacts can see your status',
    },
    {
      id: 'selected',
      label: 'My Contacts Except...',
      icon: 'people-circle-outline',
      description: 'Choose who can\'t see your status',
    },
    {
      id: 'only_me',
      label: 'Only Share With...',
      icon: 'person-outline',
      description: 'Choose specific people to share with',
    },
  ];

  const handleSelectMedia = (type) => {
    const options = {
      mediaType: type,
      maxWidth: 1080,
      maxHeight: 1920,
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled media selection');
      } else if (response.error) {
        console.log('Media selection error: ', response.error);
        Alert.alert('Error', 'Failed to select media');
      } else if (response.assets && response.assets[0]) {
        setSelectedMedia(response.assets[0]);
        setStatusType(type === 'photo' ? 'photo' : 'video');
      }
    });
  };

  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1080,
      maxHeight: 1920,
      quality: 1,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera error: ', response.error);
        Alert.alert('Error', 'Failed to capture photo');
      } else if (response.assets && response.assets[0]) {
        setSelectedMedia(response.assets[0]);
        setStatusType('photo');
      }
    });
  };

  const handleRemoveMedia = () => {
    Alert.alert(
      'Remove Media',
      'Are you sure you want to remove this media?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setSelectedMedia(null);
              setStatusType('text');
              fadeAnim.setValue(1);
            });
          },
        },
      ]
    );
  };

  const handlePostStatus = () => {
    if (statusType === 'text' && !caption.trim()) {
      Alert.alert('Error', 'Please add some text to your status');
      return;
    }

    const statusData = {
      type: statusType,
      caption: caption.trim(),
      media: selectedMedia,
      backgroundColor: statusType === 'text' ? backgroundColor : null,
      textColor: statusType === 'text' ? textColor : null,
      fontSize: statusType === 'text' ? fontSize : null,
      fontStyle: statusType === 'text' ? fontStyle : null,
      privacy,
      selectedContacts: privacy !== 'contacts' ? selectedContacts : [],
      duration,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
    };

    console.log('New status created:', statusData);

    Alert.alert(
      'Success',
      'Your status has been posted',
      [
        {
          text: 'OK',
          onPress: () => navigation.back(),
        },
      ]
    );
  };

  const isPostEnabled = () => {
    if (statusType === 'text' && caption.trim()) return true;
    if ((statusType === 'photo' || statusType === 'video') && selectedMedia) return true;
    return false;
  };

  const renderTextEditor = () => (
    <View style={styles.textEditorContainer}>
      <View style={[styles.textPreview, { backgroundColor }]}>
        <TextInput
          ref={captionInputRef}
          style={[
            styles.textInput,
            {
              color: textColor,
              fontSize,
              fontFamily: 'System',
              fontStyle: fontStyle === 'italic' ? 'italic' : 'normal',
              fontWeight: fontStyle === 'bold' ? 'bold' : 'normal',
            },
          ]}
          placeholder="Type a status..."
          placeholderTextColor={textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'}
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
          textAlign="center"
        />
        <Text style={[styles.charCounter, { color: textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)' }]}>
          {caption.length}/500
        </Text>
      </View>

      {/* Background Colors */}
      <View style={styles.optionsSection}>
        <Text style={styles.optionTitle}>Background Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {backgroundColors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                backgroundColor === color && styles.colorOptionSelected,
              ]}
              onPress={() => setBackgroundColor(color)}
            >
              {backgroundColor === color && (
                <Icon name="checkmark" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Text Colors */}
      <View style={styles.optionsSection}>
        <Text style={styles.optionTitle}>Text Color</Text>
        <View style={styles.rowOptions}>
          {textColors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.textColorOption,
                { backgroundColor: color },
                textColor === color && styles.textColorOptionSelected,
              ]}
              onPress={() => setTextColor(color)}
            >
              <Text style={[styles.textColorSample, { color: color === '#FFFFFF' ? '#000' : '#fff' }]}>
                Aa
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Font Styles */}
      <View style={styles.optionsSection}>
        <Text style={styles.optionTitle}>Font Style</Text>
        <View style={styles.rowOptions}>
          {fontStyles.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.fontStyleOption,
                fontStyle === style.id && styles.fontStyleOptionSelected,
              ]}
              onPress={() => setFontStyle(style.id)}
            >
              <Text style={[styles.fontStyleText, fontStyle === style.id && styles.fontStyleTextSelected]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Font Size */}
      <View style={styles.optionsSection}>
        <Text style={styles.optionTitle}>Font Size: {fontSize}</Text>
        <View style={styles.fontSizeContainer}>
          <TouchableOpacity
            onPress={() => setFontSize(Math.max(16, fontSize - 2))}
            style={styles.fontSizeButton}
          >
            <Icon name="remove" size={20} color="#075E54" />
          </TouchableOpacity>
          <View style={styles.fontSizeSlider}>
            <View style={[styles.sliderFill, { width: `${((fontSize - 16) / 24) * 100}%` }]} />
          </View>
          <TouchableOpacity
            onPress={() => setFontSize(Math.min(40, fontSize + 2))}
            style={styles.fontSizeButton}
          >
            <Icon name="add" size={20} color="#075E54" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderMediaPreview = () => (
    <Animated.View style={[styles.mediaPreviewContainer, { opacity: fadeAnim }]}>
      <View style={styles.mediaPreview}>
        <Image
          source={{ uri: selectedMedia?.uri }}
          style={styles.mediaImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.removeMediaButton}
          onPress={handleRemoveMedia}
        >
          <Icon name="close-circle" size={30} color="#F44336" />
        </TouchableOpacity>
        
        {/* Caption Overlay */}
        <View style={styles.captionOverlay}>
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={200}
          />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.back("chatList")}
          style={styles.headerButton}
        >
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Create Status</Text>
          <Text style={styles.headerSubtitle}>
            {statusType === 'text' ? 'Text Status' : 
             statusType === 'photo' ? 'Photo Status' : 'Video Status'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.postButton,
            !isPostEnabled() && styles.postButtonDisabled,
          ]}
          onPress={handlePostStatus}
          disabled={!isPostEnabled()}
        >
          <Text style={[
            styles.postButtonText,
            !isPostEnabled() && styles.postButtonTextDisabled,
          ]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media Selection Buttons */}
      {!selectedMedia && (
        <View style={styles.mediaSelectionContainer}>
          <TouchableOpacity
            style={styles.mediaOption}
            onPress={() => {
              setStatusType('text');
              captionInputRef.current?.focus();
            }}
          >
            <View style={[styles.mediaIcon, statusType === 'text' && styles.mediaIconActive]}>
              <Icon name="text-outline" size={28} color={statusType === 'text' ? '#075E54' : '#999'} />
            </View>
            <Text style={[styles.mediaLabel, statusType === 'text' && styles.mediaLabelActive]}>
              Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaOption}
            onPress={() => handleSelectMedia('photo')}
          >
            <View style={styles.mediaIcon}>
              <Icon name="images-outline" size={28} color="#999" />
            </View>
            <Text style={styles.mediaLabel}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaOption}
            onPress={handleTakePhoto}
          >
            <View style={styles.mediaIcon}>
              <Icon name="camera-outline" size={28} color="#999" />
            </View>
            <Text style={styles.mediaLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaOption}
            onPress={() => handleSelectMedia('video')}
          >
            <View style={styles.mediaIcon}>
              <Icon name="videocam-outline" size={28} color="#999" />
            </View>
            <Text style={styles.mediaLabel}>Video</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedMedia ? renderMediaPreview() : renderTextEditor()}

        {/* Privacy Settings */}
        <View style={styles.privacySection}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          {privacyOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.privacyOption,
                privacy === option.id && styles.privacyOptionSelected,
              ]}
              onPress={() => setPrivacy(option.id)}
            >
              <View style={styles.privacyLeft}>
                <View style={styles.privacyRadio}>
                  {privacy === option.id && <View style={styles.privacyRadioFill} />}
                </View>
                <View style={styles.privacyInfo}>
                  <View style={styles.privacyLabelRow}>
                    <Icon name={option.icon} size={20} color="#000" />
                    <Text style={styles.privacyLabel}>{option.label}</Text>
                  </View>
                  <Text style={styles.privacyDescription}>{option.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration Settings */}
        <View style={styles.durationSection}>
          <Text style={styles.sectionTitle}>Status Duration</Text>
          <View style={styles.durationOptions}>
            {[24, 48, 72].map((hours) => (
              <TouchableOpacity
                key={hours}
                style={[
                  styles.durationOption,
                  duration === hours && styles.durationOptionSelected,
                ]}
                onPress={() => setDuration(hours)}
              >
                <Text style={[
                  styles.durationText,
                  duration === hours && styles.durationTextSelected,
                ]}>
                  {hours}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


export default CreateStatus;
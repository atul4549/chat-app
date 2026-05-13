import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useRouter, useLocalSearchParams } from "expo-router";
const CallScreen = () => {
    const navigation = useRouter()
  const { chatName } = useLocalSearchParams();
  const [callStatus, setCallStatus] = useState('dialing');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigation.back();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.callerInfo}>
        <View style={styles.callerAvatar}>
          <Text style={styles.avatarText}>
            {/* {chatName.charAt(0)} */}
H
          </Text>
        </View>
        <Text style={styles.callerName}>{chatName}</Text>
        <Text style={styles.callStatus}>
          {callStatus === 'dialing'
            ? 'Calling...'
            : callStatus === 'connected'
            ? formatDuration(duration)
            : 'Call Ended'}
        </Text>
      </View>

      {callStatus !== 'ended' && (
        <View style={styles.callActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Icon name="volume-high-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Icon name="mic-off-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <View style={[styles.actionIcon, styles.endCallIcon]}>
              <Icon name="call-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.actionText}>End</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callerInfo: {
    alignItems: 'center',
    marginBottom: 100,
  },
  callerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  callStatus: {
    fontSize: 16,
    color: '#999',
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  endCallButton: {
    marginLeft: 30,
  },
  endCallIcon: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default CallScreen;

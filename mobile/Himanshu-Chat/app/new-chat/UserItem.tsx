// User item component
const UserItem = ({ user, onPress, isSelected }) => {
  const getInitials = (name) => {
      return name?.charAt(0).toUpperCase() || '?';
    };
  
    return (
      <TouchableOpacity 
        style={[styles.userItem, isSelected && styles.userItemSelected]} 
        onPress={() => onPress(user)}
        activeOpacity={0.7}
      >
        <View style={styles.userAvatar}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
          )}
          {user.isOnline && <View style={styles.onlineDot} />}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.bio && <Text style={styles.userBio} numberOfLines={1}>{user.bio}</Text>}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#6B6B70" />
      </TouchableOpacity>
    );
  };

export default UserItem
  
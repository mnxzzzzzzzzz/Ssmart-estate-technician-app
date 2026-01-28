import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { Button, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Media } from '../types';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 64) / 3;

interface Props {
  jobId: number;
  media: Media[];
  onMediaUpload: (newMedia: Media[]) => void;
}

const MediaUploader: React.FC<Props> = ({ jobId, media, onMediaUpload }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const handleAddMedia = (): void => {
    Alert.alert('Add Media', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => handleCameraCapture(),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => handleGalleryPick(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleCameraCapture = async (): Promise<void> => {
    // Implement camera capture
    // Using expo-image-picker or react-native-image-picker
    try {
      // Placeholder for camera implementation
      const mockImage: Media = {
        id: Date.now(),
        uri: 'https://via.placeholder.com/400',
        type: 'image',
        category: 'before',
        timestamp: new Date().toISOString(),
      };

      await uploadMedia(mockImage);
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleGalleryPick = async (): Promise<void> => {
    // Implement gallery picker
    // Using expo-image-picker or react-native-image-picker
    try {
      // Placeholder for gallery implementation
      const mockImage: Media = {
        id: Date.now(),
        uri: 'https://via.placeholder.com/400',
        type: 'image',
        category: 'after',
        timestamp: new Date().toISOString(),
      };

      await uploadMedia(mockImage);
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadMedia = async (mediaItem: Media): Promise<void> => {
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', {
        uri: mediaItem.uri,
        type: 'image/jpeg',
        name: `job_${jobId}_${Date.now()}.jpg`,
      } as any);
      formData.append('category', mediaItem.category);

      const response = await fetch(`YOUR_API_BASE_URL/jobs/${jobId}/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onMediaUpload([data.media]);
        Alert.alert('Success', 'Media uploaded successfully');
      } else {
        Alert.alert('Error', 'Failed to upload media');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleMediaPress = (item: Media): void => {
    setSelectedMedia(item);
    setPreviewVisible(true);
  };

  const handleDeleteMedia = (mediaId: number): void => {
    Alert.alert('Delete Media', 'Are you sure you want to delete this media?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Implement delete API call
          const updatedMedia = media.filter((m) => m.id !== mediaId);
          onMediaUpload(updatedMedia);
        },
      },
    ]);
  };

  const renderMediaItem: ListRenderItem<Media> = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => handleMediaPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.mediaImage} />
      <View style={styles.mediaOverlay}>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor:
                item.category === 'before' ? '#FF9500' : '#34C759',
            },
          ]}
        >
          <Text style={styles.categoryText}>
            {item.category === 'before' ? 'Before' : 'After'}
          </Text>
        </View>
      </View>
      {item.type === 'video' && (
        <View style={styles.videoIndicator}>
          <MaterialCommunityIcons name="play-circle" size={32} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = (): JSX.Element => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="camera-outline" size={48} color="#BDBDBD" />
      <Text style={styles.emptyText}>No photos or videos added yet</Text>
      <Text style={styles.emptySubtext}>
        Add before and after photos to document your work
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={handleAddMedia}
        icon="camera-plus"
        style={styles.addButton}
        loading={uploading}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Add Photos/Videos'}
      </Button>

      {media.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.mediaGrid}
          scrollEnabled={false}
        />
      )}

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              size={24}
              iconColor="#FFFFFF"
              onPress={() => setPreviewVisible(false)}
            />
            <IconButton
              icon="delete"
              size={24}
              iconColor="#FFFFFF"
              onPress={() => {
                setPreviewVisible(false);
                if (selectedMedia) {
                  handleDeleteMedia(selectedMedia.id);
                }
              }}
            />
          </View>
          {selectedMedia && (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  addButton: {
    marginBottom: 16,
    borderColor: '#6366F1',
  },
  mediaGrid: {
    gap: 8,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 40,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
});

export default MediaUploader;

import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [image, setImage] = useState(null);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!mediaPermission) {
      requestMediaPermission();
    }
  }, []);

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ base64: false });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ base64: false });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createFile = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or capture an image first.");
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(image);
      await MediaLibrary.createAlbumAsync('Pictures', asset, false);
      Alert.alert('Success', 'Image saved to Pictures folder!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Open Camera" onPress={openCamera} />
      <Button title="Open Gallery" onPress={openGallery} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Create File" onPress={createFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});

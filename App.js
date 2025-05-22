import React, { useState, useEffect, Dimensions } from 'react';
import { View, Button, Image, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { app, storage } from './firebaseConfig';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';

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


  const db = getFirestore(app);
	const gambarCollection = collection(db, 'Week11');

   const simpanGambar = async () => {
		console.log("simpan Gambar called");
		try {
		  console.log("1");
		  const docRef = await addDoc(gambarCollection, {
			url_image: image,
      latitude: location.latitude,
      longitude: location.longitude,
			timestamp: new Date(),
		  });
		  console.log('Dokumen berhasil ditambahkan dengan ID: ', docRef.id);
		  alert('URL Gambar dengan lokasi berhasil disimpan!');
		} catch (error) {
		  console.log("2");
		  console.error('Error menambahkan dokumen: ', error);
		  alert('Gagal menyimpan gambar.');
		}
	  };

    

    const [location, setLocation] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin lokasi tidak diberikan');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };


  return (
    <View style={styles.container}>
      <Button title="Open Camera" onPress={openCamera} />
      <Button title="Open Gallery" onPress={openGallery} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Create File" onPress={createFile} />
      <Button title="Simpan Gambar" onPress={simpanGambar} />
      <Text>Maaf gabisa simpan gambar cuma bisa simpan URL gambar karena butuh firebase storage perlu bayar pake duit T_T</Text>
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

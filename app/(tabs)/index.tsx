import { Text, View, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { type ImageSource } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import ImageViewer from '@/components/imageViewer';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisble, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  const pickerImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image');
    }
  }
  if (status === null) {
    requestPermission();
  }

  const onReset = () => {
    setShowAppOptions(false);
  }
  const onAddSticker = () => {
    setIsModalVisible(true);
  }
  const onModalClose = () => {
    setIsModalVisible(false);
  }
  const onSaveImageAsync = async () => {
    if(Platform.OS !== 'web'){
        try {
          // Capture d'écran
          const localUri = await captureRef(imageRef, {
            height: 440,
            quality: 1,
          });
          // Enregistrement dans la galerie
          await MediaLibrary.saveToLibraryAsync(localUri);
          if (localUri) {
            alert('Saved!')
          }
        } catch (error) {
          alert(error);
        }  
      } else {
        try {
          const dataUrl = await domtoimage.toJpeg(imageRef.current, {
            quality: 0.95,
            width: 320,
            height: 440, 
          });

          let link = document.createElement('a');
          link.download = 'sticker-smash.jpeg';
          link.href = dataUrl;
          link.click();
        } catch (error) {
          console.log(error);
        }
      }
      
    
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <Text style={styles.text}>Home screen</Text> */}
      {/* <Link href="/about" style={styles.button}>Go ta About screen</Link> */}
      <View style={styles.imageContainer}>
        {/*ImageRef : Référence à la capture d'écran*/}
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>

      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon='refresh' label='Reset' onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon='save-alt' label='Save' onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button label='Choose a photo' theme='primary' onPress={pickerImageAsync} />
          <Button label='Use this photo' onPress={() => setShowAppOptions(true)} />
        </View>
      )}

      <EmojiPicker isVisible={isModalVisble} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'none',
    padding: 10,
    borderRadius: 8,
    color: '#25292e',
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

import ImagePicker from 'react-native-image-crop-picker';
import * as nativeBase from 'native-base';

function onClickAddImages() {
  const Buttons = ['Chup anh', 'Chon anh tu thu vien', 'Thoat'];
  nativeBase.ActionSheet.show(
    {
      options: Buttons,
      cancelButtonIndex: 2,
      title: 'Tai avatar moi',
    },
    buttonIndex => {
      switch (buttonIndex) {
        case 0:
          takePhotoFromCamera();
          break;
        case 1:
          chosePhotoFromLibrary();
          break;
        default:
          break;
      }
    },
  );
}

function chosePhotoFromLibrary() {
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
  }).then(image => {
    this.setState({
      image: image.path,
      imageType: image.mime,
    });
    this._postImage(this.state.accessToken, image);
    console.log(image.path);
  });
}
function takePhotoFromCamera() {
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
  }).then(image => {
    this.setState({
      image: image.path,
      imageType: image.mime,
    });
    this._postImage(this.state.accessToken, image);
    console.log(image.path);
  });
}
export default onClickAddImages;

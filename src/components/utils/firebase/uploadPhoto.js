import * as firebase from 'firebase/app';
import uuidv1 from 'uuid/v1';
import getCurrentUser from './getCurrentUser';

const uploadPhotos = (file, setProgess) => {
  setProgess(1);
  return new Promise(async (resolve, reject) => {
    // Create a root reference
    let storageRef = firebase.storage().ref();
    // Create the file metadata
    let metadata = {
      contentType: file.type,
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    let extension;
    switch (file.type) {
      case 'image/jpeg':
        extension = '.jpg';
        break;
      case 'image/png':
        extension = '.png';
        break;
      default:
        extension = '.jpg';
    }
    const { uid } = await getCurrentUser();
    let uploadTask = storageRef
      .child(`users/${uid}/${uuidv1() + extension}`)
      .put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setProgess(progress);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
          default:
            console.log('toto');
        }
      },
      function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            console.log('storage/unauthorized');
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            console.log('storage/canceled');
            // User canceled the upload
            break;

          case 'storage/unknown':
            console.log('storage/unknown');
            // Unknown error occurred, inspect error.serverResponse
            break;
          default:
            console.log('toto');
        }
        reject();
      },
      async function () {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        resolve(downloadURL);
      }
    );
  });
};

export default uploadPhotos;

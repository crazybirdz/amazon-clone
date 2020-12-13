import { firebaseInstance, dbService, storageService } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

const storageRef = storageService.ref();

export function createUser(uid, data) {
  return dbService
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}

export async function createProduct(data) {
  try {
    const imageRef = storageRef.child(`${data.ownerId}/${uuidv4()}`);
    const response = await imageRef.put(data.img);
    const imageUrl = await response.ref.getDownloadURL();

    const productData = {
      ...data,
      img: imageUrl,
    };
    const products = dbService.collection('products').doc();

    await products.set(productData);

    return productData.productName;
  } catch (err) {
    console.log(err);
  }
}
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const loader = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'));
    const locations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(locations);
    return locations;
  } catch (e) {
    console.error('Error getting documents: ', e);
    return [];
  }
}
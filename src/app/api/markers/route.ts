import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { redirect } from 'next/navigation';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'));
    const markerData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return new Response(JSON.stringify(markerData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Error getting documents: ', e);
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());
  console.log(JSON.stringify(data));

  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      title: data.title,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }

  return redirect('/');
}
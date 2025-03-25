import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'));
    const markers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(markers);
  } catch (e) {
    console.error('Error fetching markers:', e);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { title, latitude, longitude, description, rating, file } = data;

  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      title,
      latitude,
      longitude,
      description,
      rating,
      file
    });
    console.log('Document written with ID:', docRef.id);
    return NextResponse.json({ id: docRef.id });
  } catch (e) {
    console.error('Error adding document:', e);
    return NextResponse.error();
  }
}

export async function PUT(req: Request) {
  const data = await req.json();
  const { id, title, latitude, longitude, description, rating, file } = data;

  if (!id) {
    return NextResponse.error();
  }

  try {
    const docRef = doc(db, 'locations', id);
    await updateDoc(docRef, {
      title,
      latitude,
      longitude,
      description,
      rating,
      file
    });

    console.log('Document updated with ID:', id);
    return NextResponse.json({ id });
  } catch (e) {
    console.error('Error updating document:', e);
    return NextResponse.error();
  }
}

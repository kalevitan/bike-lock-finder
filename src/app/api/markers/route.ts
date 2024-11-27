import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'));
    const markers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(markers); // Return markers as JSON
  } catch (e) {
    console.error('Error fetching markers:', e);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  const data = await req.json(); // Expecting JSON data instead of form data
  const { title, latitude, longitude, description } = data;

  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      title,
      latitude,
      longitude,
      description,
    });
    console.log('Document written with ID:', docRef.id);
    return NextResponse.json({ id: docRef.id });
  } catch (e) {
    console.error('Error adding document:', e);
    return NextResponse.error();
  }
}

export async function PUT(req: Request) {
  const data = await req.json(); // Expecting JSON body
  const { id, title, latitude, longitude, description } = data;

  if (!id) {
    return NextResponse.error(); // No ID found, return error
  }

  try {
    const docRef = doc(db, 'locations', id); // Get document reference by ID
    await updateDoc(docRef, {
      title,
      latitude,
      longitude,
      description,
    });

    console.log('Document updated with ID:', id);
    return NextResponse.json({ id }); // Return updated document ID
  } catch (e) {
    console.error('Error updating document:', e);
    return NextResponse.error(); // Handle error and return error response
  }
}

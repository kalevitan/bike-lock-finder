import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const querySnapshot = await adminDb.collection("locations").get();
    const markers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(markers);
  } catch (e) {
    const error = e as Error;
    console.error("Error fetching markers:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const docRef = await adminDb.collection("locations").add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log("Document written with ID:", docRef.id);
    return NextResponse.json({ id: docRef.id });
  } catch (e) {
    const error = e as Error;
    console.error("Error adding document:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("locations").doc(id);
    await docRef.update({
      ...updateData,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log("Document updated with ID:", id);
    return NextResponse.json({ id });
  } catch (e) {
    const error = e as Error;
    console.error("Error updating document:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

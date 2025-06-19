import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const userDocRef = adminDb.collection("users").doc(uid);

    // Use a transaction to safely increment the contributions
    await adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (userDoc.exists) {
        const currentContributions = userDoc.data()?.contributions || 0;
        transaction.update(userDocRef, {
          contributions: currentContributions + 1,
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        // If user doc somehow doesn't exist, create it with 1 contribution
        transaction.set(
          userDocRef,
          {
            contributions: 1,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing user contributions:", error);
    return NextResponse.json(
      { message: "Failed to increment contributions" },
      { status: 500 }
    );
  }
}

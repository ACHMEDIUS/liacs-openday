"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import { Question } from "../../types/Question";

export default function MainQuestionPage() {
  const [mainQuestion, setMainQuestion] = useState<Question | null>(null);

  useEffect(() => {
    // Listen only for the question marked as main
    const q = query(collection(db, "questions"), where("main", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Expecting only one main question, so we pick the first one
        const doc = snapshot.docs[0];
        setMainQuestion({ id: doc.id, ...doc.data() } as Question);
      } else {
        setMainQuestion(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="flex items-center justify-center h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        {mainQuestion ? (
          <p className="text-5xl font-bold leading-tight tracking-tight text-black">
            {mainQuestion.text}
          </p>
        ) : (
          <p className="text-4xl font-bold leading-tight tracking-tight text-black">
            Nog geen vragen.
          </p>
        )}
      </div>
    </main>
  );
}

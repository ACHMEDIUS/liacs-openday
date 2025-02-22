"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";
import { Question } from "../../../types/Question";

export default function QnAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  // Fetch all questions (accepted or not) in real time
  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Question[] = [];
      snapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Question);
      });
      setQuestions(data);
    });

    return () => unsubscribe();
  }, []);

  // Toggle acceptance of a question
  const toggleAccept = async (id: string, currentValue: boolean) => {
    try {
      await updateDoc(doc(db, "questions", id), {
        accepted: !currentValue,
      });
    } catch (err) {
      console.error("Failed to update acceptance:", err);
    }
  };

  // Delete a question
  const removeQuestion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "questions", id));
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Q&A Management</h1>

      {questions.length === 0 ? (
        <p>No questions submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="border p-4 rounded">
              <p className="mb-2">{q.text}</p>
              <section className="flex gap-2">
                <button
                  onClick={() => toggleAccept(q.id, q.accepted)}
                  className={`px-3 py-1 rounded ${
                    q.accepted ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  {q.accepted ? "Accepted" : "Accept"}
                </button>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="px-3 py-1 rounded bg-red-200"
                >
                  Delete
                </button>
              </section>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

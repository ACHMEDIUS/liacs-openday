"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import { Question } from "../../types/Question";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Listen to only 'accepted' questions
    const q = query(
      collection(db, "questions"),
      where("accepted", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Question[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Question);
      });
      setQuestions(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Accepted Questions</h1>

      {questions.length === 0 ? (
        <p className="text-leiden">No questions yet. Be the first to add one!</p>
      ) : (
        <ul className="space-y-2">
          {questions.map((q) => (
            <li key={q.id} className="border-b pb-2 text-black">
              {q.text}
            </li>
          ))}
        </ul>
      )}

      <section className="mt-6">
        <Link
          href="/questions/add"
          className="inline-block bg-leiden text-white px-4 py-2 rounded hover:bg-leiden-dark"
        >
          + Add a Question
        </Link>
      </section>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";

export default function AddQuestionPage() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, "questions"), {
        text: text.trim(),
        accepted: false, // new questions are not accepted by default
        createdAt: serverTimestamp(),
      });
      router.push("/questions"); // go back to the list of accepted questions
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Submit a Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full h-24 border p-2 text-black"
          placeholder="Type your question here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-leiden text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

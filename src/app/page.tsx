// This is the home page: /

import Link from "next/link";
import { getTodaysPuzzle } from "@/lib/puzzles/queries";

export const metadata = {
  title: 'Connections',
  description: 'Connections made by Brandon Yang',
};

export default function HomePage() {
  const todaysPuzzle = getTodaysPuzzle();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-center space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Connections by Brandon Yang</h1>
        <p className="text-lg text-gray-600">
          Welcome to my collection of Connections boards, all made uniquely by me!
        </p>

        <nav className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href={`/puzzles/${todaysPuzzle.id}`} className="rounded bg-black px-5 py-3 text-white">
            Play today&apos;s puzzle
          </Link>

          <Link href="/puzzles" className="rounded border border-gray-300 px-5 py-3">
            See all puzzles
          </Link>

          <Link href="/about" className="text-gray-600 underline">
            About
          </Link>
        </nav>
      </section>
    </main>
  );
}
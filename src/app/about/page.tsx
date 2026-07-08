import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
            <h1 className="text-3xl font-bold">About</h1>
            <p>
                Hi, I&apos;m Brandon! I built this site to show off my collection of personal Connections boards. Every board you play here was handwritten and designed by me. I hope you enjoy playing these puzzles as much as I enjoy thinking about them!
            </p>
            <p>
                I also built this website as a way to practice building a full-stack web application with Next.js, React, and TypeScript. The interactive game board is built with React, the game logic is written in TypeScript, and the pages are organized via the Next.js App Router.
            </p>
            <Link href="/" className="underline">Back Home</Link>
        </main>
    );
}
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          AI Content Writer
        </h1>
        <p className="text-center text-gray-600 mt-4">
          Your AI-powered writing assistant
        </p>
      </div>
    </main>
  );
}

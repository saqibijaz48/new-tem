export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to E-Commerce Store
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional e-commerce website with Next.js 14+ and multi-language
            support
          </p>
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🚀 Setup Complete!</h2>
            <p className="text-gray-700">
              Next.js 14+ with App Router and TypeScript is now configured.
              Building the full e-commerce application...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

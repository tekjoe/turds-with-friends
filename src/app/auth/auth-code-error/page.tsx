import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-rounded text-red-500 text-3xl">error</span>
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">Authentication Error</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Sorry, we couldn&apos;t sign you in. This might be due to an expired link or a temporary issue.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

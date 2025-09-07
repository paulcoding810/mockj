import { db } from "@mockj/db";
import { notFound } from "next/navigation";

export default async function JsonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await db.query.jsons.findFirst({
    where: (jsons, { eq }) => eq(jsons.id, slug),
  });

  if (!data) {
    notFound();
  }

  let formattedJson: string;
  try {
    const parsed = JSON.parse(data.json);
    formattedJson = JSON.stringify(parsed, null, 2);
  } catch {
    formattedJson = data.json;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(data.json);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              JSON Mock Endpoint
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Mock ID:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                {slug}
              </code>
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy JSON
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Endpoint
          </h3>
          <code className="text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border block">
            GET /api/json/{slug}
          </code>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            JSON Response
          </h2>
        </div>
        <div className="p-6">
          <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
            {formattedJson}
          </pre>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Usage Example
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Use this endpoint in your applications for testing and development:
        </p>
        <code className="text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded border block">
          fetch('/api/json/{slug}').then(response =&gt; response.json())
        </code>
      </div>
    </div>
  );
}

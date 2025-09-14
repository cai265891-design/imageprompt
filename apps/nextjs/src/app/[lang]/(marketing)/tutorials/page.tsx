import { type Locale, i18n } from "~/config/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function TutorialsPage({
  params,
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
        Tutorials
      </h1>
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg mx-auto">
          <p className="text-center text-gray-600 mb-8">
            Learn how to use our AI-powered image prompt tools effectively.
          </p>
          
          <div className="grid gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-600">
                Learn the basics of image prompt generation and how to get the best results from our AI tools.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Advanced Techniques</h2>
              <p className="text-gray-600">
                Discover advanced prompting techniques to create more sophisticated and detailed AI-generated images.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
              <p className="text-gray-600">
                Tips and tricks for writing effective prompts that produce consistent, high-quality results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
type Props = {
  struggles: string[];
  recommendations: string[];
};

export function RealityCheckCard({ struggles, recommendations }: Props) {
  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <h3 className="text-lg font-semibold text-indigo-900">Reality Check</h3>
      <p className="mt-1 text-sm text-indigo-800">Top struggle areas right now:</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-indigo-900">
        {struggles.length ? struggles.map((item) => <li key={item}>{item}</li>) : <li>No major struggle signals today.</li>}
      </ul>
      <p className="mt-3 text-sm font-semibold text-indigo-900">Recommended next lessons:</p>
      <ul className="mt-1 list-disc pl-5 text-sm text-indigo-900">
        {recommendations.map((lessonId) => (
          <li key={lessonId}>{lessonId}</li>
        ))}
      </ul>
    </section>
  );
}

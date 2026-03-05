export default function CommunityPage() {
  const categories = ["Questions", "Testimonies", "Prayer Requests", "Local Groups"];
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold">Community</h1>
      <p className="text-sm text-slate-700">Moderated categories and testimony wall stubs are included for role-based approval workflow.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category} className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-semibold">{category}</h2>
            <p className="mt-2 text-sm text-slate-600">Posting requires moderation approval. Flagging and removal controls supported in admin route.</p>
          </article>
        ))}
      </div>
    </div>
  );
}

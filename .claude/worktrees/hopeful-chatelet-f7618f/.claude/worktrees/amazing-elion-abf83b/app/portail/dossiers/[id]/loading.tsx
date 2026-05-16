export default function DossierDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-5 w-28 rounded-sm bg-surface-alt" />
        <div className="h-10 w-2/3 rounded-sm bg-surface-alt" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-[28rem] rounded-lg bg-surface-alt lg:col-span-2" />
          <div className="h-[28rem] rounded-lg bg-surface-alt" />
        </div>
      </div>
    </div>
  );
}

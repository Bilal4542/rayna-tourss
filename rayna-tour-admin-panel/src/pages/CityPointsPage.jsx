import ResourceSection from "../components/ResourceSection";

const CityPointsPage = () => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-surface-900">City Points</h2>
        <p className="text-sm text-surface-600">Manage places inside each city.</p>
      </div>
      <ResourceSection
        title="City Point Management"
        resourcePath="/city-points"
        enableBanner
      />
    </section>
  );
};

export default CityPointsPage;

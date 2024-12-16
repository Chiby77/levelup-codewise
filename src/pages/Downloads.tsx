import Navbar from "@/components/Navbar";

const Downloads = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-primary mb-6">Downloads</h1>
        <p className="text-lg text-gray-700">
          Coming soon: Access our comprehensive study materials.
        </p>
      </div>
    </div>
  );
};

export default Downloads;
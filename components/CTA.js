import Image from "next/image";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="relative overflow-hidden py-32">
      <Image
        src="/wholesale-warehouse.jpg"
        alt="Wholesale Warehouse"
        className="object-cover"
        fill
      />
      <div className="absolute inset-0 bg-blue-900 bg-opacity-75"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Revolutionize Your Wholesale Business?
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Join thousands of successful wholesalers who have transformed their operations with WholesalePro.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="px-8 py-3 text-lg bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
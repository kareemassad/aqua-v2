const Stats = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Empowering Wholesale Businesses
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Join thousands of wholesalers who have transformed their operations
            with WholesalePro.
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
          <div className="flex flex-col">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
              Order Processing Time
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-blue-600">
              50%
            </dd>
            <dd className="order-3 text-sm text-gray-500">Faster</dd>
          </div>
          <div className="flex flex-col mt-10 sm:mt-0">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
              Inventory Accuracy
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-blue-600">
              99%
            </dd>
            <dd className="order-3 text-sm text-gray-500">Improved</dd>
          </div>
          <div className="flex flex-col mt-10 sm:mt-0">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
              Customer Satisfaction
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-blue-600">
              95%
            </dd>
            <dd className="order-3 text-sm text-gray-500">Positive Feedback</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Stats;

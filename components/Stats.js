const Stats = () => {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              80% of startups fail because founders never launch
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Don&apos;t let your startup become a statistic. Launch fast and iterate with ShipFast.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Faster Launch</dt>
              <dd className="order-1 text-5xl font-extrabold text-indigo-600">2x</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Code Reduction</dt>
              <dd className="order-1 text-5xl font-extrabold text-indigo-600">50%</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Customer Satisfaction</dt>
              <dd className="order-1 text-5xl font-extrabold text-indigo-600">99%</dd>
            </div>
          </dl>
        </div>
      </section>
    );
  };
  
  export default Stats;
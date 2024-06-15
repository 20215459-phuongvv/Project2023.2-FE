import MultipleItemsCarousel from "../components/customers/MultiItemCarousel";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="">
      <section className="-z-50 banner relative flex flex-col justify-center items-center">
        <div className="w-[50vw] z-10 text-center">
          <p className="text-2xl lg:text-7xl font-bold z-10 py-5">HUSTAURANT</p>
          <p className="z-10   text-gray-300 text-xl lg:text-4xl">
            Taste the Convenience
          </p>
        </div>

        <div className="cover absolute top-0 left-0 right-0"></div>
        <div className="fadout"></div>
      </section>

      <section className="p-10 lg:py-10 lg:px-20">
        <div className="">
          <p className="text-2xl font-semibold text-gray-400 py-3 pb-10">
            Top Meels
          </p>
          <MultipleItemsCarousel />
        </div>
      </section>
    </div>
  );
};

export default HomePage;

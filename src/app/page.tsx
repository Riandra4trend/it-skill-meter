import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row md:px-16 pt-56">
        <div className="flex flex-col w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl mb-4 text-black">
            Mulailah <span className="font-bold">karir IT</span>{" "}
            <span className="font-bold">impianmu</span> dari sini!
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-6">
            Pilih roadmap karir IT yang sesuai dengan ambisimu, lakukan
            wawancara interaktif, dan dapatkan feedback untuk mengasah kemampuan
            IT kamu!
          </p>
          <a className="bg-primary-red text-white px-6 py-3 rounded-xl font-semibold w-24 text-center">
            Mulai
          </a>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img src="/home-icon.svg" alt="Icon" className="w-64 md:w-96" />
        </div>
      </div>
    </>
  );
}

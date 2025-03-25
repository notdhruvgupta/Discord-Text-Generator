import About from "./(components)/About";
import Navbar from "./(components)/Navbar";
import Input from "./(components)/Input";

export default function Home() {
  return (
    <div className="mt-5 mb-10 md:mx-[25%] mx-4 space-y-10">
      <Navbar />
      <Input />
      <About />
    </div>
  );
}

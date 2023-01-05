import Head from 'next/head';
import Navbar from '../components/Navbar';
import Main from '../components/Main';

//className="bg-gradient-to-tr from-black via-black to-[#1a0000] md:h-screen"
export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-black via-black to-[#1a0000] md:h-screen">
      <Head>Title</Head>
      <main className="">
        <Navbar />
        <Main />
      </main>
    </div>
  );
}

import ChapterNav from "@/components/ChapterNav";
import Epilogue from "@/components/Epilogue";
import Header from "@/components/Header";
import Story from "@/components/Story";

export default function Home() {
  return (
    <>
      <div id="top" />
      <Header />
      <ChapterNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Story />
      </main>
      <Epilogue />
    </>
  );
}

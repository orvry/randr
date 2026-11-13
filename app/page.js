import GardenDefs from "../components/GardenDefs";
import Header from "../components/Header";
import ChapterNav from "../components/ChapterNav";
import Hero from "../components/Hero";
import Couple from "../components/Couple";
import Polaroids from "../components/Polaroids";
import Adventures from "../components/Adventures";
import Proposal from "../components/Proposal";
import Invitation from "../components/Invitation";
import RsvpSection from "../components/RsvpSection";

export default function Home() {
  return (
    <>
      <GardenDefs />
      <Header />
      <ChapterNav />
      <main>
        <Hero />
        <Couple />
        <Polaroids />
        <Adventures />
        <Proposal />
        <Invitation />
        <RsvpSection />
      </main>
      <footer>Made with love · Russelle &amp; Rosie · 2027</footer>
    </>
  );
}

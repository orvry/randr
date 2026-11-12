import GardenDefs from '../components/GardenDefs';
import Header from '../components/Header';
import ZoomScenes from '../components/ZoomScenes';
import RsvpSection from '../components/RsvpSection';

export default function Home() {
  return (
    <>
      <GardenDefs />
      <Header />
      <main>
        <ZoomScenes />
        <RsvpSection />
      </main>
      <footer>Made with love · Russelle &amp; Rosie · 2027</footer>
    </>
  );
}

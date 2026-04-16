import { Outlet } from "react-router";
import { Header } from "./Header";
import { BlinkControls } from "./BlinkControls";
import { useBlink } from "../contexts/BlinkContext";
import { useEyeContext } from "./EyeContext";

export function Layout() {
  const blinkContext = useBlink();
  const { seconds, message, isTracking, isFaceDetected } = useEyeContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pb-72">
        <Outlet />
      </main>

      <BlinkControls />
    </div>
  );
}
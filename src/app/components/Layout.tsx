import { Outlet } from "react-router";
import { Header } from "./Header";
import { BlinkControls } from "./BlinkControls";
import { useBlink } from "../contexts/BlinkContext";
import { useEyeContext } from "./EyeContext";

export function Layout() {
  const blinkContext = useBlink();
  const { seconds, message, isTracking, isFaceDetected } = useEyeContext();

  const showDeleteButton = blinkContext?.showDeleteButton ?? true;
  const showSendButton = blinkContext?.showSendButton ?? true;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />


      <main className="pb-72">
        <Outlet />
      </main>

      <BlinkControls 
        showDeleteButton={showDeleteButton}
        showSendButton={showSendButton}
      />
    </div>
  );
}
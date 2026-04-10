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

      {/* <div className="pointer-events-none fixed left-1/2 top-20 z-40 w-[min(92vw,56rem)] -translate-x-1/2 px-4">
        <div className="rounded-2xl border border-border/70 bg-background/90 px-4 py-2 text-center shadow-xl backdrop-blur">
          <p className="text-sm font-semibold text-foreground">
            {isTracking
              ? isFaceDetected
                ? message
                : "أظهر وجهك أمام الكاميرا حتى يبدأ العد"
              : "جارٍ تشغيل التتبع..."}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {seconds > 0 ? `العداد الحالي: ${seconds}/7` : "العداد يتجدد تلقائيًا حتى 7 ثوانٍ"}
          </p>
        </div>
      </div> */}

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
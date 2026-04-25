import { Outlet } from "react-router";
import { Header } from "./Header";
import { BlinkControls } from "./BlinkControls";
import ScrollToTop from "./ScrollToTop";

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <Header />

      <main className="pb-72">
        <Outlet />
      </main>

      <BlinkControls />
    </div>
  );
}
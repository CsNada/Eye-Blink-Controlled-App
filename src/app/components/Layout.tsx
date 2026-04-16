import { Outlet } from "react-router";
import { Header } from "./Header";
import { BlinkControls } from "./BlinkControls";

export function Layout() {
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
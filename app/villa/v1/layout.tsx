import { VillaStoreProvider } from "@/lib/layouts/villa/store";
import { VillaAuthProvider } from "@/lib/layouts/villa/auth";

// Wraps the Azure Villas landing + dashboard + detail pages so they share one
// localStorage-backed catalogue and the mock owner auth.
export default function VillaV1Layout({ children }: { children: React.ReactNode }) {
  return (
    <VillaAuthProvider>
      <VillaStoreProvider>{children}</VillaStoreProvider>
    </VillaAuthProvider>
  );
}

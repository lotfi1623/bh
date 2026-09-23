import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center pt-28">
      <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-4">404</p>
      <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-muted text-sm mb-10 max-w-sm">
        This path doesn&apos;t exist in the Brotherhood.
      </p>
      <Button href="/" variant="primary">
        Back Home
      </Button>
    </div>
  );
}

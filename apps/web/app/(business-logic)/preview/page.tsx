"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  if (!url) return <div className="flex h-screen items-center justify-center text-zinc-500">No preview URL provided.</div>;

  return (
    <iframe
      src={url}
      className="h-screen w-screen border-0 bg-white"
      title="Full Screen Preview"
      allow="cross-origin-isolated"
      // @ts-ignore
      credentialless="true"
    />
  );
}

export default function FullScreenPreview() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
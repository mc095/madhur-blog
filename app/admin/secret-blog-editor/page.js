"use client";

import { Suspense } from "react";
import SecretBlogEditor from "./SecretBlogEditor";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <SecretBlogEditor />
    </Suspense>
  );
}

import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "mdx"],
  devIndicators: false,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-math"],
    rehypePlugins: ["rehype-katex"],
  },
});

export default withMDX(nextConfig);

import { NextResponse } from "next/server";

const releasesEndpoint =
  "https://api.github.com/repos/GabrielContesini/CodeTrailWindows/releases/latest";
const releasePage =
  "https://github.com/GabrielContesini/CodeTrailWindows/releases/latest";

type GitHubAsset = {
  name: string;
  browser_download_url: string;
};

type GitHubRelease = {
  assets?: GitHubAsset[];
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const response = await fetch(releasesEndpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "CodeTrail-LandingPage",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.redirect(releasePage, { status: 307 });
    }

    const release = (await response.json()) as GitHubRelease;
    const asset = release.assets?.find(
      ({ name }) =>
        name.toLowerCase().endsWith(".exe") &&
        name.toLowerCase().includes("setup"),
    );

    if (!asset) {
      return NextResponse.redirect(releasePage, { status: 307 });
    }

    return NextResponse.redirect(asset.browser_download_url, { status: 307 });
  } catch {
    return NextResponse.redirect(releasePage, { status: 307 });
  }
}

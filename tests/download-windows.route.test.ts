import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("GET /download/windows", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("redirects directly to the setup asset when the release contains it", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          assets: [
            {
              name: "CodeTrailWindows-1.1.4+7-setup.exe",
              browser_download_url: "https://downloads.example.com/setup.exe",
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const { GET } = await import("../app/download/windows/route");
    const response = await GET();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://downloads.example.com/setup.exe",
    );
  });

  it("falls back to the GitHub release page when the asset is missing", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ assets: [] }), { status: 200 }),
    );

    const { GET } = await import("../app/download/windows/route");
    const response = await GET();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://github.com/GabrielContesini/CodeTrailWindows/releases/latest",
    );
  });

  it("falls back to the GitHub release page when the API fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network failed"));

    const { GET } = await import("../app/download/windows/route");
    const response = await GET();

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://github.com/GabrielContesini/CodeTrailWindows/releases/latest",
    );
  });
});

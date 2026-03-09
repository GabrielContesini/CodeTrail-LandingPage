import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) => {
    // Next image is not required for static assertions in this suite.
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ""} src={String(props.src ?? "")} />;
  },
}));

describe("Landing page", () => {
  it("renders the main product narrative and primary CTAs", async () => {
    const { default: Home } = await import("../app/page");
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("CodeTrail");
    expect(html).toContain("Baixar versao Windows");
    expect(html).toContain("Conhecer versao mobile");
    expect(html).toContain("Roadmap");
  });

  it("does not expose infrastructure terms in the public copy", async () => {
    const { default: Home } = await import("../app/page");
    const html = renderToStaticMarkup(<Home />).toLowerCase();

    expect(html).not.toContain("supabase");
    expect(html).not.toContain("fila de sync");
    expect(html).not.toContain("service_role");
  });
});

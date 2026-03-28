import type { BillingPlanCode } from "@/utils/workspace/types";

type EntryTarget = "workspace" | "download";
type SearchParamValue = string | string[] | undefined;

export function buildCodeTrailWebEntryHref({
  originHint,
  plan,
  target = "workspace",
}: {
  originHint?: string;
  plan?: BillingPlanCode;
  target?: EntryTarget;
}) {
  if (plan) {
    return buildCodeTrailWebAuthHref({
      originHint,
      plan,
      target,
      returnTo:
        plan === "pro" || plan === "founding"
          ? buildLandingReturnUrl(originHint)
          : undefined,
    });
  }

  return buildUrl(target === "download" ? "/download/windows" : "/auth", originHint);
}

export function buildCodeTrailWebAuthHref({
  originHint,
  plan,
  target = "workspace",
  returnTo,
}: {
  originHint?: string;
  plan?: BillingPlanCode | null;
  target?: EntryTarget;
  returnTo?: string;
}) {
  return buildUrlWithParams(
    "/auth",
    {
      ...(plan ? { plan } : {}),
      ...(target !== "workspace" ? { target } : {}),
      ...(returnTo ? { returnTo } : {}),
    },
    originHint,
  );
}

export function buildCodeTrailWebWorkspaceHref({
  originHint,
  slug = [],
  searchParams,
}: {
  originHint?: string;
  slug?: string[];
  searchParams?: Record<string, SearchParamValue>;
}) {
  const pathname = slug.length
    ? `/workspace/${slug.map(encodeURIComponent).join("/")}`
    : "/workspace/dashboard";
  return buildUrlWithParams(pathname, searchParams, originHint);
}

export function getRequestOriginHint(headersLike: Pick<Headers, "get">) {
  const proto = headersLike.get("x-forwarded-proto") ?? "https";
  const host = headersLike.get("x-forwarded-host") ?? headersLike.get("host");

  if (!host) {
    return undefined;
  }

  return `${proto}://${host}`;
}

function resolveCodeTrailWebOrigin(originHint?: string) {
  const configuredOrigin = normalizeOrigin(
    process.env.NEXT_PUBLIC_CODETRAIL_WEB_URL,
  ) ?? "https://www.codetrail.online";

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const inferredOrigin = normalizeOrigin(originHint)
    ? inferOriginFromHint(normalizeOrigin(originHint)!)
    : null;

  return inferredOrigin;
}

function normalizeOrigin(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function inferOriginFromHint(originHint: string) {
  const currentUrl = new URL(originHint);

  if (isLocalHost(currentUrl.hostname)) {
    const targetPort = resolveLocalWebPort(currentUrl.port);
    currentUrl.port = targetPort;
    return currentUrl.origin;
  }

  return null;
}

function buildLandingReturnUrl(originHint?: string) {
  const normalizedOrigin = normalizeOrigin(originHint);
  if (!normalizedOrigin) {
    return undefined;
  }

  return new URL("/", normalizedOrigin).toString();
}

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function resolveLocalWebPort(currentPort: string) {
  if (process.env.NEXT_PUBLIC_CODETRAIL_WEB_PORT) {
    return process.env.NEXT_PUBLIC_CODETRAIL_WEB_PORT;
  }

  if (!currentPort || currentPort === "3000") {
    return "3001";
  }

  return currentPort;
}

function appendSearchParams(
  search: URLSearchParams,
  searchParams?: Record<string, SearchParamValue>,
) {
  if (!searchParams) {
    return;
  }

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          search.append(key, item);
        }
      });
      return;
    }

    if (value) {
      search.set(key, value);
    }
  });
}

export function parseBillingPlan(plan: string | null | undefined) {
  if (plan === "free" || plan === "pro" || plan === "founding") {
    return plan;
  }

  return null;
}

function buildUrl(pathname: string, originHint?: string) {
  const externalOrigin = resolveCodeTrailWebOrigin(originHint);

  if (externalOrigin) {
    return new URL(pathname, externalOrigin).toString();
  }

  return pathname;
}

function buildUrlWithParams(
  pathname: string,
  searchParams: Record<string, SearchParamValue> | undefined,
  originHint?: string,
) {
  const externalOrigin = resolveCodeTrailWebOrigin(originHint);

  if (externalOrigin) {
    const url = new URL(pathname, externalOrigin);
    appendSearchParams(url.searchParams, searchParams);
    return url.toString();
  }

  const query = new URLSearchParams();
  appendSearchParams(query, searchParams);
  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

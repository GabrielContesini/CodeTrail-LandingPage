import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/utils/server/rate-limit";
import { sendSupportEmail } from "@/utils/server/support";
import { sanitizeSupportInput, validateSupportInput } from "@/utils/support/shared";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_CACHE_CONTROL = "private, no-store, max-age=0, must-revalidate";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const rateLimit = checkRateLimit({
    namespace: "support-submit",
    key: getClientIp(request),
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    logSupportEvent({
      level: "warn",
      event: "rate_limited",
      requestId,
      status: 429,
      metadata: {
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
    });

    return jsonResponse(
      { error: "Muitas mensagens em pouco tempo. Aguarde um pouco e tente novamente." },
      {
        status: 429,
        requestId,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      { error: "Não foi possível ler os dados enviados." },
      {
        status: 400,
        requestId,
      },
    );
  }

  const input = sanitizeSupportInput(payload as Record<string, unknown>);
  const validation = validateSupportInput(input);

  if (!validation.valid) {
    return jsonResponse(
      {
        error: "Revise os campos obrigatórios antes de enviar.",
        fieldErrors: validation.fieldErrors,
      },
      {
        status: 400,
        requestId,
      },
    );
  }

  try {
    const emailMeta = await sendSupportEmail({
      input,
      request,
      userPlan: "Visitante / Landing Page",
    });

    logSupportEvent({
      event: "message_sent",
      requestId,
      metadata: {
        origin: input.origin,
        authenticated: input.authenticated,
        pageUrl: input.pageUrl,
        userPlan: "Visitante / Landing Page",
        browser: emailMeta.browser,
        operatingSystem: emailMeta.operatingSystem,
      },
    });

    return jsonResponse(
      {
        success: true,
        message: "Sua mensagem foi enviada com sucesso. Nosso suporte retornará em breve.",
      },
      {
        requestId,
      },
    );
  } catch (error) {
    logSupportEvent({
      level: "error",
      event: "message_failed",
      requestId,
      status: 500,
      metadata: {
        origin: input.origin,
        message: error instanceof Error ? error.message : "unknown",
      },
    });

    return jsonResponse(
      {
        error: "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.",
      },
      {
        status: 500,
        requestId,
      },
    );
  }
}

function jsonResponse(
  body: unknown,
  options: {
    status?: number;
    requestId: string;
    headers?: HeadersInit;
  },
) {
  const response = NextResponse.json(body, {
    status: options.status ?? 200,
    headers: options.headers,
  });

  response.headers.set("Cache-Control", NO_STORE_CACHE_CONTROL);
  response.headers.set("x-request-id", options.requestId);

  return response;
}

function logSupportEvent(options: {
  event: string;
  requestId: string;
  level?: "info" | "warn" | "error";
  status?: number;
  metadata?: Record<string, unknown>;
}) {
  const payload = {
    timestamp: new Date().toISOString(),
    scope: "codetrail-landing-page",
    area: "support",
    event: options.event,
    requestId: options.requestId,
    status: options.status,
    metadata: options.metadata,
  };

  const level = options.level ?? "info";
  console[level](JSON.stringify(payload));
}

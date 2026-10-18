const GA_ID = /^(G-[A-Z0-9]+|GTM-[A-Z0-9]+|UA-\d+-\d+)$/;
const META_PIXEL_ID = /^\d{5,20}$/;
const TIKTOK_PIXEL_ID = /^[A-Za-z0-9]{8,40}$/;

export type AnalyticsConfig = {
  gaId: string | null;
  metaPixelId: string | null;
  tiktokPixelId: string | null;
};

function matchId(value: string | undefined, pattern: RegExp) {
  const trimmed = value?.trim() ?? "";
  return pattern.test(trimmed) ? trimmed : null;
}

export function readAnalytics(env: NodeJS.ProcessEnv = process.env): AnalyticsConfig {
  return {
    gaId: matchId(env.NEXT_PUBLIC_GA_ID, GA_ID),
    metaPixelId: matchId(env.NEXT_PUBLIC_META_PIXEL_ID, META_PIXEL_ID),
    tiktokPixelId: matchId(env.NEXT_PUBLIC_TIKTOK_PIXEL_ID, TIKTOK_PIXEL_ID),
  };
}

export function analyticsEnabled(config: AnalyticsConfig) {
  return Boolean(config.gaId || config.metaPixelId || config.tiktokPixelId);
}

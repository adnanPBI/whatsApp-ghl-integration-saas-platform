export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    service: "whats-app-ghl-integration-saas-platform",
    ts: new Date().toISOString(),
  });
}

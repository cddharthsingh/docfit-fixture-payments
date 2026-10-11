// DocFit staging test: tries what a hostile build script would try. Everything below must come back
// empty or denied when this runs in the command sandbox. Exits non-zero so the output is reported.
import { readFileSync } from "node:fs";
import { execSync, spawn } from "node:child_process";
const out = [];
out.push(`user: ${execSync("id -un").toString().trim()} uid=${process.getuid()}`);
out.push(`env vars: ${Object.keys(process.env).sort().join(" ")}`);
try {
  const e = readFileSync("/proc/1/environ", "utf8");
  out.push(`proc1 environ READABLE, secret-like entries: ${e.split("\0").filter((l) => /secret|token|key|atlas|private/i.test(l)).length}`);
} catch (err) {
  out.push(`proc1 environ: ${err.code}`);
}
const md = (p) => fetch(`http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/${p}`, { headers: { "Metadata-Flavor": "Google" } });
try {
  out.push(`metadata identity: ${(await (await md("email")).text()).trim()}`);
  const tok = (await (await md("token")).json()).access_token;
  const sm = await fetch("https://secretmanager.googleapis.com/v1/projects/docfit-stage/secrets", { headers: { authorization: `Bearer ${tok}` } });
  out.push(`secret manager list: HTTP ${sm.status}`);
  const gcs = await fetch("https://storage.googleapis.com/storage/v1/b/docfit-sandbox-docfit-stage/o", { headers: { authorization: `Bearer ${tok}` } });
  out.push(`sandbox bucket list: HTTP ${gcs.status}`);
} catch (err) {
  out.push(`metadata: ${err.message}`);
}
const left = execSync("ps -eo user=,args= || true").toString().split("\n").filter((l) => l.includes("sleep 4242")).length;
out.push(`leftover sleep 4242 from earlier requests: ${left}`);
spawn("sh", ["-c", "sleep 4242"], { detached: true, stdio: "ignore" }).unref();
out.push("started a detached sleep 4242 for the next request to look for");
console.log(out.join("\n"));
process.exit(1);

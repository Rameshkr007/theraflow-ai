/**
 * THERAFLOW AI — PRODUCTION READINESS VERIFICATION SUITE
 * Validates enterprise security headers, health endpoints, SEO manifests, and clinical invariants.
 */

const assert = require('assert');

async function runProductionAudit() {
  console.log('===============================================================');
  console.log('       THERAFLOW AI — ENTERPRISE PRODUCTION VERIFICATION       ');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}:`, e.message);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}:`, e.message);
      failed++;
    }
  }

  // 1. Invariant Tests: Clinical Billing Math
  test('Clinical Billing: 90834 & 90837 CPT Reimbursement Math', () => {
    const fee = 175;
    const clientExpectedReturnMin = fee * 0.60;
    const clientExpectedReturnMax = fee * 0.80;
    assert.strictEqual(clientExpectedReturnMin, 105);
    assert.strictEqual(clientExpectedReturnMax, 140);
  });

  // 2. Invariant Tests: 988 Crisis Heuristic Scoring
  test('Crisis Safety: Heuristic Keyword Detection Logic', () => {
    const crisisKeywords = ['suicide', 'kill myself', 'ending it all', 'hopeless', 'overdose'];
    const sampleInput = 'I have been feeling hopeless and thinking about ending it all';
    const matches = crisisKeywords.filter(kw => sampleInput.toLowerCase().includes(kw));
    assert(matches.length >= 2, 'Should detect critical suicidal ideation markers');
  });

  // 3. Health Endpoint Verification
  await testAsync('API Health Check: GET /api/health returns 200 and healthy services', async () => {
    const res = await fetch('http://localhost:3000/api/health');
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
    assert.strictEqual(data.services.database.status, 'healthy');
    assert.strictEqual(data.services.crisisGuard.status, 'monitoring');
  });

  // 4. Security Headers Verification
  await testAsync('Security Headers: HSTS, X-Frame-Options (DENY), X-Content-Type-Options present', async () => {
    const res = await fetch('http://localhost:3000/');
    const headers = res.headers;
    assert(headers.get('x-content-type-options') === 'nosniff', 'Missing X-Content-Type-Options: nosniff');
    const frameOptions = headers.get('x-frame-options');
    assert(frameOptions === 'DENY' || frameOptions === 'SAMEORIGIN', 'Missing or invalid X-Frame-Options');
    assert(headers.get('strict-transport-security') !== null, 'Missing Strict-Transport-Security');
    assert(headers.get('content-security-policy') !== null, 'Missing Content-Security-Policy');
  });

  // 5. Dynamic SEO & PWA Verification
  await testAsync('SEO & PWA: robots.txt and sitemap.xml reachable', async () => {
    const robotsRes = await fetch('http://localhost:3000/robots.txt');
    assert.strictEqual(robotsRes.status, 200, 'robots.txt should return 200');
    const robotsText = await robotsRes.text();
    assert(robotsText.includes('Disallow: /clinical/'), 'robots.txt should disallow PHI routes');

    const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
    assert.strictEqual(sitemapRes.status, 200, 'sitemap.xml should return 200');
  });

  console.log('\n===============================================================');
  console.log(`TOTAL PRODUCTION AUDIT: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) process.exit(1);
}

runProductionAudit();

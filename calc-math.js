// calc-math.js — extra math helpers for calculators
(function () {
  const { normCDF, normPDF } = window.Stats;

  // Inverse normal CDF via bisection (good enough for calculators)
  function invNormal(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    let lo = -8, hi = 8;
    for (let i = 0; i < 60; i++) {
      const m = (lo + hi) / 2;
      if (normCDF(m) < p) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  }

  // Wilson-Hilferty chi-square CDF approximation
  function chi2CDF(x, k) {
    if (x <= 0) return 0;
    if (k < 1) k = 1;
    const v = Math.cbrt(x / k);
    const z = (v - (1 - 2 / (9 * k))) / Math.sqrt(2 / (9 * k));
    return normCDF(z);
  }

  // Student t CDF — use Hill 1970 approximation, sufficient for clinical work
  function tCDF(t, df) {
    if (df > 200) return normCDF(t);
    if (df < 1) df = 1;
    // Cornish-Fisher style adjustment from normal
    const x = df / (df + t * t);
    // Compute incomplete beta I_x(df/2, 1/2) via continued fraction approximation
    // Simpler: use Hill 1970 t-to-z transform
    const a = df - 0.5;
    const b = 48 * a * a;
    let z = a * Math.log(1 + (t * t) / df);
    z = (((((-0.4 * z - 3.3) * z - 24) * z - 85.5) /
          (0.8 * z * z + 100 + b) + z + 3) / b + 1) * Math.sqrt(z);
    const sign = t < 0 ? -1 : 1;
    return normCDF(sign * z);
  }

  // Two-sided p from t / z
  function pFromT(t, df) {
    return 2 * (1 - tCDF(Math.abs(t), df));
  }
  function pFromZ(z) {
    return 2 * (1 - normCDF(Math.abs(z)));
  }
  function pFromChi2(x, df) {
    return 1 - chi2CDF(x, df);
  }

  // log of gamma function (Lanczos)
  const G = 7;
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  function logGamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    x -= 1;
    let a = C[0];
    const t = x + G + 0.5;
    for (let i = 1; i < G + 2; i++) a += C[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function gamma(x) { return Math.exp(logGamma(x)); }

  // Binomial CDF
  function binomCDF(k, n, p) {
    let s = 0;
    for (let i = 0; i <= k; i++) s += window.Stats.binomPMF(i, n, p);
    return Math.min(1, s);
  }
  function poissonCDF(k, lambda) {
    let s = 0;
    for (let i = 0; i <= k; i++) s += window.Stats.poissonPMF(i, lambda);
    return Math.min(1, s);
  }

  // F distribution CDF via beta — use Wilson-Hilferty alternative
  function fCDF(F, df1, df2) {
    if (F <= 0) return 0;
    // Use chi2 approximation: F * df1 / (F*df1 + df2) ~ Beta(df1/2, df2/2)
    // For calculators use the simpler form via normal approximation of log(F)
    const x = df2 / (df2 + df1 * F);
    // I_x(df2/2, df1/2)
    // Use Paulson's approximation via normal
    const num = (1 - 2 / (9 * df2)) * Math.cbrt(F) - (1 - 2 / (9 * df1));
    const den = Math.sqrt(Math.cbrt(F * F) * 2 / (9 * df2) + 2 / (9 * df1));
    const z = num / den;
    return normCDF(z);
  }
  function pFromF(F, df1, df2) {
    return 1 - fCDF(F, df1, df2);
  }

  // Wilson 95% CI for proportion
  function wilsonCI(x, n, conf = 0.95) {
    const z = invNormal((1 + conf) / 2);
    const p = x / n;
    const denom = 1 + z * z / n;
    const center = (p + z * z / (2 * n)) / denom;
    const half = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom;
    return [Math.max(0, center - half), Math.min(1, center + half)];
  }

  // z values for common conf levels
  function zForConf(conf) {
    return invNormal((1 + conf) / 2);
  }

  window.CalcMath = {
    invNormal, chi2CDF, tCDF, fCDF,
    pFromT, pFromZ, pFromChi2, pFromF,
    binomCDF, poissonCDF,
    logGamma, gamma,
    wilsonCI, zForConf
  };
})();

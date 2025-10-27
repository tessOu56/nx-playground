/**
 * Security Headers Verification Script
 *
 * Checks if security headers are properly configured for production deployment.
 * Run: tsx apps/profile/scripts/verify-security-headers.ts [url]
 */

const REQUIRED_HEADERS = [
  'content-security-policy',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
];

const RECOMMENDED_HEADERS = ['strict-transport-security'];

interface HeaderCheckResult {
  header: string;
  present: boolean;
  value?: string;
  score: number;
  issues: string[];
}

async function checkSecurityHeaders(url: string): Promise<void> {
  console.log(`\n🔒 Checking security headers for: ${url}\n`);

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;

    const results: HeaderCheckResult[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Check required headers
    for (const headerName of REQUIRED_HEADERS) {
      maxScore += 10;
      const value = headers.get(headerName);
      const present = !!value;
      const issues: string[] = [];
      let score = 0;

      if (present) {
        score = 10;

        // Additional checks
        if (headerName === 'content-security-policy') {
          if (
            value!.includes('unsafe-inline') &&
            value!.includes('script-src')
          ) {
            issues.push('⚠️  Uses unsafe-inline for scripts (consider nonce)');
            score -= 2;
          }
          if (value!.includes('unsafe-eval')) {
            issues.push('⚠️  Uses unsafe-eval (security risk)');
            score -= 3;
          }
          if (!value!.includes('upgrade-insecure-requests')) {
            issues.push('💡 Consider adding upgrade-insecure-requests');
          }
        }

        if (
          headerName === 'x-frame-options' &&
          value !== 'DENY' &&
          value !== 'SAMEORIGIN'
        ) {
          issues.push(`⚠️  Weak value: ${value}`);
          score -= 5;
        }
      } else {
        issues.push('❌ Header missing');
      }

      totalScore += score;
      results.push({
        header: headerName,
        present,
        value: value || undefined,
        score,
        issues,
      });
    }

    // Check recommended headers
    for (const headerName of RECOMMENDED_HEADERS) {
      maxScore += 5;
      const value = headers.get(headerName);
      const present = !!value;
      const issues: string[] = [];
      let score = 0;

      if (present) {
        score = 5;

        if (headerName === 'strict-transport-security') {
          if (!value!.includes('max-age')) {
            issues.push('⚠️  Missing max-age');
            score -= 2;
          }
          if (!value!.includes('includeSubDomains')) {
            issues.push('💡 Consider adding includeSubDomains');
          }
        }
      } else {
        issues.push('💡 Recommended but missing');
      }

      totalScore += score;
      results.push({
        header: headerName,
        present,
        value: value || undefined,
        score,
        issues,
      });
    }

    // Print results
    console.log(
      '┌─────────────────────────────────────────────────────────────┐'
    );
    console.log(
      '│                    Security Headers Report                  │'
    );
    console.log(
      '└─────────────────────────────────────────────────────────────┘\n'
    );

    for (const result of results) {
      const status = result.present ? '✅' : '❌';
      console.log(`${status} ${result.header.toUpperCase()}`);

      if (result.value) {
        console.log(
          `   Value: ${result.value.substring(0, 80)}${
            result.value.length > 80 ? '...' : ''
          }`
        );
      }

      if (result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`   ${issue}`));
      }

      console.log(
        `   Score: ${result.score}/${
          result.header in REQUIRED_HEADERS ? 10 : 5
        }\n`
      );
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const grade =
      percentage >= 90
        ? 'A'
        : percentage >= 75
        ? 'B'
        : percentage >= 60
        ? 'C'
        : percentage >= 50
        ? 'D'
        : 'F';

    console.log(
      '┌─────────────────────────────────────────────────────────────┐'
    );
    console.log(
      `│  Overall Security Score: ${totalScore}/${maxScore} (${percentage}%) - Grade: ${grade}  │`
    );
    console.log(
      '└─────────────────────────────────────────────────────────────┘\n'
    );

    if (percentage < 75) {
      console.log('⚠️  Security headers need improvement!\n');
      process.exit(1);
    } else {
      console.log('✅ Security headers look good!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error checking headers:', error);
    process.exit(1);
  }
}

// Get URL from command line or use default
const url = process.argv[2] || 'http://localhost:3003';
checkSecurityHeaders(url);

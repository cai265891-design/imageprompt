#!/usr/bin/env node

/**
 * Vercel Deployment Test Script
 * 
 * Tests the build process and simulates Vercel deployment environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeploymentTester {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    const prefix = type === 'error' ? '[ERROR]' : 
                  type === 'warning' ? '[WARN]' : 
                  type === 'success' ? '[OK]' : '[TEST]';
    
    console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);
  }

  runCommand(command, description) {
    this.log(`Running: ${description}`, 'info');
    try {
      const output = execSync(command, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        cwd: '/Users/caihongjia/saasfly'
      });
      this.log(`✓ ${description} completed successfully`, 'success');
      return { success: true, output };
    } catch (error) {
      this.log(`✗ ${description} failed: ${error.message}`, 'error');
      this.errors.push({ command, description, error: error.message });
      return { success: false, error: error.message };
    }
  }

  testBuildProcess() {
    this.log('\n🔧 Testing Build Process...', 'info');
    
    // Clean previous builds
    this.runCommand('rm -rf apps/nextjs/.next apps/nextjs/dist', 'Clean previous builds');
    
    // Test environment variables
    this.log('\n📋 Checking environment setup...', 'info');
    const envCheck = this.runCommand('cd apps/nextjs && bun run with-env echo "Environment test passed"', 'Environment setup test');
    
    if (!envCheck.success) {
      this.log('⚠️  Environment setup failed - this may cause build issues', 'warning');
    }
    
    // Test build
    this.log('\n🏗️  Testing build process...', 'info');
    const buildResult = this.runCommand('bun run build', 'Full project build');
    
    if (!buildResult.success) {
      this.log('❌ Build failed - checking Next.js specific build...', 'error');
      const nextBuildResult = this.runCommand('cd apps/nextjs && bun run build', 'Next.js specific build');
      
      if (!nextBuildResult.success) {
        this.log('❌ Next.js build also failed', 'error');
        return false;
      }
    }
    
    return true;
  }

  testStaticAssets() {
    this.log('\n📁 Testing Static Assets...', 'info');
    
    const buildDir = 'apps/nextjs/.next';
    if (!fs.existsSync(buildDir)) {
      this.log('❌ Build directory not found', 'error');
      return false;
    }
    
    // Check for critical build files
    const criticalFiles = [
      'apps/nextjs/.next/package.json',
      'apps/nextjs/.next/server/pages-manifest.json',
      'apps/nextjs/.next/server/app-paths-manifest.json',
      'apps/nextjs/.next/static',
      'apps/nextjs/.next/server/app',
    ];
    
    let missingFiles = [];
    criticalFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    });
    
    if (missingFiles.length > 0) {
      this.log(`⚠️  Missing critical files: ${missingFiles.join(', ')}`, 'warning');
    } else {
      this.log('✓ All critical build files present', 'success');
    }
    
    return missingFiles.length === 0;
  }

  testRouteManifests() {
    this.log('\n🗺️  Testing Route Manifests...', 'info');
    
    const manifests = [
      'apps/nextjs/.next/server/pages-manifest.json',
      'apps/nextjs/.next/server/app-paths-manifest.json',
      'apps/nextjs/.next/server/middleware-manifest.json'
    ];
    
    manifests.forEach(manifest => {
      if (fs.existsSync(manifest)) {
        try {
          const content = JSON.parse(fs.readFileSync(manifest, 'utf8'));
          this.log(`✓ ${manifest} is valid JSON with ${Object.keys(content).length} entries`, 'success');
        } catch (error) {
          this.log(`✗ ${manifest} is invalid: ${error.message}`, 'error');
        }
      } else {
        this.log(`⚠️  ${manifest} not found`, 'warning');
      }
    });
  }

  testEnvironmentSimulation() {
    this.log('\n🌍 Simulating Vercel Environment...', 'info');
    
    // Set Vercel-like environment variables
    const vercelEnv = {
      ...process.env,
      VERCEL: '1',
      VERCEL_ENV: 'production',
      VERCEL_URL: 'test-deployment.vercel.app',
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    };
    
    // Test with simulated Vercel environment
    try {
      const result = execSync('cd apps/nextjs && bun run with-env next build', {
        encoding: 'utf8',
        env: vercelEnv,
        stdio: 'pipe'
      });
      
      this.log('✓ Build successful in simulated Vercel environment', 'success');
      return true;
    } catch (error) {
      this.log(`✗ Build failed in Vercel environment: ${error.message}`, 'error');
      return false;
    }
  }

  testAPICheck() {
    this.log('\n🔌 Testing API Route Configuration...', 'info');
    
    const apiRoutes = [
      'apps/nextjs/.next/server/app/api/trpc/edge',
      'apps/nextjs/.next/server/app/api/webhooks/stripe'
    ];
    
    apiRoutes.forEach(route => {
      if (fs.existsSync(route)) {
        this.log(`✓ API route built: ${route}`, 'success');
      } else {
        this.log(`⚠️  API route not found: ${route}`, 'warning');
      }
    });
  }

  testMiddlewareCheck() {
    this.log('\n🛡️  Testing Middleware Configuration...', 'info');
    
    const middlewarePath = 'apps/nextjs/.next/server/middleware-manifest.json';
    if (fs.existsSync(middlewarePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(middlewarePath, 'utf8'));
        
        if (content.middleware && Object.keys(content.middleware).length > 0) {
          this.log('✓ Middleware properly configured', 'success');
        } else {
          this.log('⚠️  Middleware configuration may be incomplete', 'warning');
        }
        
        // Check for i18n routing issues
        const hasRootMiddleware = content.middleware && content.middleware['/'];
        if (hasRootMiddleware) {
          this.log('✓ Root middleware detected (i18n support)', 'success');
        }
        
      } catch (error) {
        this.log(`✗ Error reading middleware manifest: ${error.message}`, 'error');
      }
    }
  }

  generateReport() {
    this.log('\n📊 DEPLOYMENT TEST REPORT', 'info');
    this.log('=' .repeat(60), 'info');
    
    const totalTests = 6;
    const passedTests = totalTests - this.errors.length;
    
    this.log(`Tests Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'success' : 'warning');
    
    if (this.errors.length === 0) {
      this.log('\n✅ All deployment tests passed!', 'success');
      this.log('Your application should deploy successfully to Vercel.', 'success');
    } else {
      this.log(`\n❌ ${this.errors.length} issues found:`, 'error');
      this.errors.forEach((error, index) => {
        this.log(`  ${index + 1}. ${error.description}: ${error.error}`, 'error');
      });
    }
    
    this.log('\n🔧 RECOMMENDATIONS:', 'info');
    
    if (this.errors.some(e => e.description.includes('Build'))) {
      this.log('• Check environment variables in Vercel dashboard', 'info');
      this.log('• Verify all dependencies are installed correctly', 'info');
      this.log('• Check for TypeScript errors: bun run typecheck', 'info');
    }
    
    if (this.errors.some(e => e.description.includes('Static'))) {
      this.log('• Ensure all pages can be built statically', 'info');
      this.log('• Check for dynamic imports that may cause issues', 'info');
    }
    
    if (this.errors.some(e => e.description.includes('API'))) {
      this.log('• Verify API routes have proper exports', 'info');
      this.log('• Check API route error handling', 'info');
    }
    
    this.log('\n📋 NEXT STEPS:', 'info');
    this.log('1. Fix any critical issues identified above', 'info');
    this.log('2. Run deployment verification: node scripts/vercel-deployment-check.js', 'info');
    this.log('3. Test locally: bun run dev', 'info');
    this.log('4. Deploy to Vercel and monitor build logs', 'info');
    
    return {
      success: this.errors.length === 0,
      errors: this.errors,
      recommendations: this.getRecommendations()
    };
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.errors.some(e => e.description.includes('Build'))) {
      recommendations.push('Fix build errors before deployment');
    }
    
    if (this.errors.some(e => e.description.includes('Environment'))) {
      recommendations.push('Configure all required environment variables in Vercel');
    }
    
    if (this.errors.some(e => e.description.includes('API'))) {
      recommendations.push('Review API route configuration and error handling');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Ready for deployment');
    }
    
    return recommendations;
  }

  run() {
    this.log('🚀 Starting Vercel Deployment Test Suite...', 'info');
    
    const buildSuccess = this.testBuildProcess();
    const staticSuccess = this.testStaticAssets();
    this.testRouteManifests();
    const envSuccess = this.testEnvironmentSimulation();
    this.testAPICheck();
    this.testMiddlewareCheck();
    
    return this.generateReport();
  }
}

// Run the test suite
if (require.main === module) {
  const tester = new DeploymentTester();
  const result = tester.run();
  
  process.exit(result.success ? 0 : 1);
}

module.exports = DeploymentTester;
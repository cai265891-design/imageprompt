#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * 
 * This script performs comprehensive checks to identify and resolve
 * common Vercel deployment issues including 404 and 204 errors.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VercelDeploymentChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.recommendations = [];
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
                  type === 'success' ? '[OK]' : '[INFO]';
    
    console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);
  }

  checkFileExists(filepath, description) {
    if (fs.existsSync(filepath)) {
      this.log(`✓ ${description} found: ${filepath}`, 'success');
      return true;
    } else {
      this.log(`✗ ${description} missing: ${filepath}`, 'error');
      this.issues.push(`Missing ${description}: ${filepath}`);
      return false;
    }
  }

  checkVercelConfig() {
    this.log('\n🔍 Checking Vercel Configuration...', 'info');
    
    const vercelConfigPath = './vercel.json';
    if (this.checkFileExists(vercelConfigPath, 'Vercel configuration')) {
      try {
        const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        
        // Check build command
        if (!config.buildCommand) {
          this.warnings.push('No buildCommand specified in vercel.json');
          this.log('⚠️  No buildCommand specified, using default', 'warning');
        }
        
        // Check install command
        if (!config.installCommand) {
          this.warnings.push('No installCommand specified in vercel.json');
          this.log('⚠️  No installCommand specified, using default', 'warning');
        }
        
        // Check framework
        if (!config.framework) {
          this.warnings.push('No framework specified in vercel.json');
          this.log('⚠️  No framework specified, using auto-detection', 'warning');
        }
        
        // Check for common misconfigurations
        if (config.outputDirectory && config.outputDirectory !== '.next') {
          this.issues.push(`Custom outputDirectory may cause issues: ${config.outputDirectory}`);
          this.log(`⚠️  Custom outputDirectory detected: ${config.outputDirectory}`, 'warning');
        }
        
      } catch (error) {
        this.issues.push('Invalid vercel.json format');
        this.log(`✗ Invalid vercel.json format: ${error.message}`, 'error');
      }
    }
  }

  checkNextJsConfig() {
    this.log('\n🔍 Checking Next.js Configuration...', 'info');
    
    const nextConfigFiles = [
      './apps/nextjs/next.config.js',
      './apps/nextjs/next.config.mjs',
      './apps/nextjs/next.config.ts'
    ];
    
    let configFound = false;
    for (const configFile of nextConfigFiles) {
      if (fs.existsSync(configFile)) {
        configFound = true;
        this.log(`✓ Next.js config found: ${configFile}`, 'success');
        
        try {
          const configContent = fs.readFileSync(configFile, 'utf8');
          
          // Check for output: 'standalone' (recommended for Vercel)
          if (configContent.includes('output:"standalone"') || configContent.includes("output: 'standalone'")) {
            this.log('✓ Standalone output configured (good for Vercel)', 'success');
          } else {
            this.warnings.push('Consider using output: "standalone" for better Vercel compatibility');
            this.log('⚠️  Standalone output not configured', 'warning');
          }
          
          // Check for output export (can cause issues)
          if (configContent.includes('output:"export"') || configContent.includes("output: 'export'")) {
            this.issues.push('Output export mode detected - this can cause 404 errors on dynamic routes');
            this.log('✗ Output export mode detected - may cause dynamic route issues', 'error');
          }
          
          // Check for trailingSlash configuration
          if (configContent.includes('trailingSlash')) {
            this.warnings.push('trailingSlash configuration detected - ensure it matches Vercel settings');
            this.log('⚠️  trailingSlash configuration found - verify Vercel compatibility', 'warning');
          }
          
        } catch (error) {
          this.issues.push(`Error reading Next.js config: ${error.message}`);
          this.log(`✗ Error reading config: ${error.message}`, 'error');
        }
        break;
      }
    }
    
    if (!configFound) {
      this.issues.push('No Next.js configuration file found');
      this.log('✗ No Next.js configuration file found', 'error');
    }
  }

  checkEnvironmentVariables() {
    this.log('\n🔍 Checking Environment Variables...', 'info');
    
    const envFiles = [
      '.env.local',
      '.env.production',
      '.env',
      'apps/nextjs/.env.local'
    ];
    
    let envFound = false;
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        envFound = true;
        this.log(`✓ Environment file found: ${envFile}`, 'success');
        
        try {
          const envContent = fs.readFileSync(envFile, 'utf8');
          
          // Check for required Vercel environment variables
          const requiredVars = [
            'NEXT_PUBLIC_APP_URL',
            'POSTGRES_URL'
          ];
          
          const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
          if (missingVars.length > 0) {
            this.warnings.push(`Missing recommended environment variables: ${missingVars.join(', ')}`);
            this.log(`⚠️  Missing recommended vars: ${missingVars.join(', ')}`, 'warning');
          }
          
          // Check for Clerk variables
          const clerkVars = [
            'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
            'CLERK_SECRET_KEY'
          ];
          
          const missingClerkVars = clerkVars.filter(varName => !envContent.includes(varName));
          if (missingClerkVars.length > 0) {
            this.warnings.push(`Missing Clerk authentication variables: ${missingClerkVars.join(', ')}`);
            this.log(`⚠️  Missing Clerk vars: ${missingClerkVars.join(', ')}`, 'warning');
          }
          
        } catch (error) {
          this.issues.push(`Error reading environment file: ${error.message}`);
          this.log(`✗ Error reading env file: ${error.message}`, 'error');
        }
        break;
      }
    }
    
    if (!envFound) {
      this.warnings.push('No environment files found - ensure Vercel environment variables are configured');
      this.log('⚠️  No environment files found', 'warning');
    }
  }

  checkRoutingStructure() {
    this.log('\n🔍 Checking Routing Structure...', 'info');
    
    // Check for app directory
    const appDir = './apps/nextjs/src/app';
    if (fs.existsSync(appDir)) {
      this.log('✓ App directory found (App Router)', 'success');
      
      // Check for middleware
      const middlewarePath = './apps/nextjs/src/middleware.ts';
      if (fs.existsSync(middlewarePath)) {
        this.log('✓ Middleware found', 'success');
        
        try {
          const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
          
          // Check for common middleware issues
          if (middlewareContent.includes('NextResponse.redirect')) {
            this.log('✓ Middleware includes redirects', 'info');
          }
          
          // Check for matcher configuration
          if (middlewareContent.includes('export const config')) {
            this.log('✓ Middleware config found', 'info');
            
            // Check for overly restrictive matcher
            if (middlewareContent.includes('_next') && middlewareContent.includes('static')) {
              this.warnings.push('Middleware matcher excludes _next/static - ensure this is intentional');
              this.log('⚠️  Middleware excludes _next/static paths', 'warning');
            }
          } else {
            this.warnings.push('No middleware config found - may cause performance issues');
            this.log('⚠️  No middleware config found', 'warning');
          }
          
        } catch (error) {
          this.issues.push(`Error reading middleware: ${error.message}`);
          this.log(`✗ Error reading middleware: ${error.message}`, 'error');
        }
      }
      
      // Check for root layout
      const rootLayout = './apps/nextjs/src/app/layout.tsx';
      if (fs.existsSync(rootLayout)) {
        this.log('✓ Root layout found', 'success');
      } else {
        this.issues.push('No root layout.tsx found');
        this.log('✗ No root layout.tsx found', 'error');
      }
      
      // Check for not-found page
      const notFoundPath = './apps/nextjs/src/app/not-found.tsx';
      if (fs.existsSync(notFoundPath)) {
        this.log('✓ Custom 404 page found', 'success');
      } else {
        this.warnings.push('No custom 404 page found - may cause generic 404 errors');
        this.log('⚠️  No custom 404 page found', 'warning');
      }
      
    } else {
      this.issues.push('App directory not found - may be using Pages Router');
      this.log('✗ App directory not found', 'error');
    }
  }

  checkAPIRoutes() {
    this.log('\n🔍 Checking API Routes...', 'info');
    
    const apiRoutesDir = './apps/nextjs/src/app/api';
    if (fs.existsSync(apiRoutesDir)) {
      this.log('✓ API routes directory found', 'success');
      
      // Check for common API route issues
      const checkRouteFile = (routePath) => {
        if (fs.existsSync(routePath)) {
          try {
            const routeContent = fs.readFileSync(routePath, 'utf8');
            
            // Check for proper HTTP method exports
            const hasMethodExports = routeContent.includes('export') && 
              (routeContent.includes('GET') || routeContent.includes('POST') || 
               routeContent.includes('PUT') || routeContent.includes('DELETE'));
            
            if (!hasMethodExports) {
              this.warnings.push(`API route may lack proper HTTP method exports: ${routePath}`);
              this.log(`⚠️  API route may lack HTTP method exports: ${routePath}`, 'warning');
            }
            
            // Check for error handling
            if (!routeContent.includes('try') || !routeContent.includes('catch')) {
              this.warnings.push(`API route lacks error handling: ${routePath}`);
              this.log(`⚠️  API route lacks error handling: ${routePath}`, 'warning');
            }
            
          } catch (error) {
            this.issues.push(`Error reading API route: ${routePath}`);
            this.log(`✗ Error reading API route: ${routePath}`, 'error');
          }
        }
      };
      
      // Check specific routes
      checkRouteFile('./apps/nextjs/src/app/api/trpc/edge/[trpc]/route.ts');
      checkRouteFile('./apps/nextjs/src/app/api/webhooks/stripe/route.ts');
      
    } else {
      this.warnings.push('No API routes directory found');
      this.log('⚠️  No API routes directory found', 'warning');
    }
  }

  checkBuildConfiguration() {
    this.log('\n🔍 Checking Build Configuration...', 'info');
    
    // Check for build scripts
    const packageJsonPath = './apps/nextjs/package.json';
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.scripts) {
          if (packageJson.scripts.build) {
            this.log(`✓ Build script found: ${packageJson.scripts.build}`, 'success');
            
            // Check for contentlayer
            if (packageJson.scripts.build.includes('contentlayer')) {
              this.log('✓ Contentlayer integration detected', 'info');
              
              // Check for contentlayer config
              const contentlayerConfig = './apps/nextjs/contentlayer.config.ts';
              if (!fs.existsSync(contentlayerConfig)) {
                this.warnings.push('Contentlayer config not found but referenced in build script');
                this.log('⚠️  Contentlayer config not found', 'warning');
              }
            }
          } else {
            this.issues.push('No build script found in package.json');
            this.log('✗ No build script found', 'error');
          }
          
          if (packageJson.scripts.start) {
            this.log(`✓ Start script found: ${packageJson.scripts.start}`, 'success');
          }
        }
        
      } catch (error) {
        this.issues.push(`Error reading package.json: ${error.message}`);
        this.log(`✗ Error reading package.json: ${error.message}`, 'error');
      }
    }
  }

  checkMonorepoStructure() {
    this.log('\n🔍 Checking Monorepo Structure...', 'info');
    
    // Check for turbo.json
    const turboConfig = './turbo.json';
    if (fs.existsSync(turboConfig)) {
      this.log('✓ Turbo configuration found', 'success');
      
      try {
        const turboContent = JSON.parse(fs.readFileSync(turboConfig, 'utf8'));
        
        if (turboContent.pipeline && turboContent.pipeline.build) {
          this.log('✓ Turbo build pipeline configured', 'success');
        } else {
          this.warnings.push('No build pipeline configured in turbo.json');
          this.log('⚠️  No build pipeline in turbo config', 'warning');
        }
        
      } catch (error) {
        this.warnings.push(`Error reading turbo.json: ${error.message}`);
        this.log(`⚠️  Error reading turbo.json: ${error.message}`, 'warning');
      }
    } else {
      this.warnings.push('No turbo.json found - may affect build caching');
      this.log('⚠️  No turbo.json found', 'warning');
    }
    
    // Check workspace configuration
    const rootPackageJson = './package.json';
    if (fs.existsSync(rootPackageJson)) {
      try {
        const rootPackage = JSON.parse(fs.readFileSync(rootPackageJson, 'utf8'));
        
        if (rootPackage.workspaces) {
          this.log('✓ Workspace configuration found', 'success');
          
          if (rootPackage.scripts && rootPackage.scripts.build) {
            this.log(`✓ Root build script: ${rootPackage.scripts.build}`, 'success');
          }
        } else {
          this.warnings.push('No workspaces configuration found');
          this.log('⚠️  No workspaces configuration', 'warning');
        }
        
      } catch (error) {
        this.warnings.push(`Error reading root package.json: ${error.message}`);
        this.log(`⚠️  Error reading root package.json: ${error.message}`, 'warning');
      }
    }
  }

  generateReport() {
    this.log('\n📊 DEPLOYMENT VERIFICATION REPORT', 'info');
    this.log('='.repeat(50), 'info');
    
    if (this.issues.length === 0) {
      this.log('\n✅ No critical issues found!', 'success');
    } else {
      this.log(`\n❌ ${this.issues.length} Critical Issues Found:`, 'error');
      this.issues.forEach((issue, index) => {
        this.log(`  ${index + 1}. ${issue}`, 'error');
      });
    }
    
    if (this.warnings.length > 0) {
      this.log(`\n⚠️  ${this.warnings.length} Warnings:`, 'warning');
      this.warnings.forEach((warning, index) => {
        this.log(`  ${index + 1}. ${warning}`, 'warning');
      });
    }
    
    if (this.recommendations.length > 0) {
      this.log(`\n💡 ${this.recommendations.length} Recommendations:`, 'info');
      this.recommendations.forEach((rec, index) => {
        this.log(`  ${index + 1}. ${rec}`, 'info');
      });
    }
    
    this.log('\n🔧 QUICK FIXES FOR COMMON ISSUES:', 'info');
    this.log('1. 404 Errors: Check middleware matcher config and output mode', 'info');
    this.log('2. 204 Errors: Verify API routes have proper HTTP method exports', 'info');
    this.log('3. Build Issues: Ensure all environment variables are set in Vercel', 'info');
    this.log('4. Routing Issues: Check locale handling in middleware', 'info');
    
    return {
      issues: this.issues,
      warnings: this.warnings,
      recommendations: this.recommendations,
      hasCriticalIssues: this.issues.length > 0
    };
  }

  run() {
    this.log('🚀 Starting Vercel Deployment Verification...', 'info');
    
    this.checkVercelConfig();
    this.checkNextJsConfig();
    this.checkEnvironmentVariables();
    this.checkRoutingStructure();
    this.checkAPIRoutes();
    this.checkBuildConfiguration();
    this.checkMonorepoStructure();
    
    return this.generateReport();
  }
}

// Run the checker
if (require.main === module) {
  const checker = new VercelDeploymentChecker();
  const result = checker.run();
  
  process.exit(result.hasCriticalIssues ? 1 : 0);
}

module.exports = VercelDeploymentChecker;
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { Card, CardContent, CardHeader } from './ui/card';

export function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">RENTBIZ</h1>
          <p className="text-muted-foreground">Rental Business Management System</p>
        </div>

        {/* Login Card */}
        <Card className="card-shadow-lg border-0">
          <CardHeader className="text-center space-y-2 pb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isRegisterMode 
                ? 'Create a new account to get started' 
                : 'Please sign in to your account'
              }
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <LoginForm onModeChange={setIsRegisterMode} />
            
            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <h3 className="font-medium text-foreground mb-3">Demo Credentials:</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-card rounded border">
                  <p className="font-medium text-foreground">Owner Account</p>
                  <p className="text-muted-foreground">Email: owner@rentalbiz.com</p>
                  <p className="text-muted-foreground">Password: demo123</p>
                </div>
                <div className="p-3 bg-card rounded border">
                  <p className="font-medium text-foreground">Operator Account</p>
                  <p className="text-muted-foreground">Email: operator@demo.com</p>
                  <p className="text-muted-foreground">Password: demo123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            © 2025 RENTBIZ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
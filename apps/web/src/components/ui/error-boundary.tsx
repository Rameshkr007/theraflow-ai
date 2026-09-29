"use client"

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

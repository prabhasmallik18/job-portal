import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error Boundary Caught:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="bg-white shadow-2xl rounded-lg p-8 max-w-2xl w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-red-700 mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-6">Sorry, the application encountered an unexpected error.</p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-gray-100 p-4 rounded text-left mb-6 text-sm max-h-64 overflow-auto">
                  <summary className="cursor-pointer font-bold text-gray-700 mb-2">Error Details</summary>
                  <p className="text-red-600 font-mono whitespace-pre-wrap break-words">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <p className="text-gray-600 font-mono whitespace-pre-wrap break-words mt-2">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </p>
                </details>
              )}

              <button
                onClick={this.handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

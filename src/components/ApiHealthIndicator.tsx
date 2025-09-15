import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { apiMonitor } from '@/utils/apiMonitoring';

const ApiHealthIndicator = () => {
  const [healthStatus, setHealthStatus] = useState<{ healthy: boolean; issues: string[] }>({ 
    healthy: true, 
    issues: [] 
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateHealth = () => {
      setHealthStatus(apiMonitor.getHealthStatus());
    };

    updateHealth();
    const interval = setInterval(updateHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (healthStatus.healthy) return 'bg-green-500';
    if (healthStatus.issues.length <= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (healthStatus.healthy) return <CheckCircle className="h-4 w-4" />;
    if (healthStatus.issues.length <= 2) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-2">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <Badge variant={healthStatus.healthy ? "default" : "destructive"} className="text-xs">
          {getStatusIcon()}
          <span className="ml-1">
            {healthStatus.healthy ? 'API Healthy' : `${healthStatus.issues.length} Issues`}
          </span>
        </Badge>
      </div>

      {showDetails && healthStatus.issues.length > 0 && (
        <Card className="w-full max-w-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              API Health Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {healthStatus.issues.map((issue, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription className="text-xs">
                  {issue}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiHealthIndicator;
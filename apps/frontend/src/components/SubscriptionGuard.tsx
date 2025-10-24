import { useEffect, useRef, type PropsWithChildren } from 'react';
import { useExtendSubscriptionMutation, useSubscriptionQuery } from '../queries';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../routes/AppRoutes';
import Loader from './Loader';
import { useAddSnackbarMessage } from '../hooks/useAddSnackBar';
import ErrorBoundary from '../hairdresser/pages/ErrorBoundary';
import { getQueryErrorMessage } from '../hairdresser/entity';

const SubscriptionGuard = (props: PropsWithChildren) => {
  const { children } = props;
  const { data: subscription, isLoading, error } = useSubscriptionQuery();
  const { mutation: extendedSubscription } = useExtendSubscriptionMutation();
  const today = new Date();
  const endDate = subscription && subscription?.endDate ? new Date(subscription.endDate) : null;
  const isExpired = endDate ? today > endDate : false;
  const addSnackBarMessage = useAddSnackbarMessage();
  const alreadyExtended = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (subscription && subscription?.status === 'EXPIRED' && subscription.id) {
      if (!alreadyExtended.current.has(subscription.id)) {
        alreadyExtended.current.add(subscription.id);
        extendedSubscription.mutate(subscription.id);
      }
    }
  }, [subscription, extendedSubscription]);

  if (subscription && subscription.status === 'ACTIVE') {
    return children;
  }

  if (!subscription && !isLoading) {
    return <Navigate to={ROUTES.subscription.path} />;
  }

  if (isLoading && !subscription) {
    return <Loader title="Ověřování předplatného..." />;
  }

  if (error) {
    addSnackBarMessage({ text: getQueryErrorMessage(error), type: 'error' });
    return <ErrorBoundary />;
  }

  if (subscription !== undefined && typeof subscription === 'string' && subscription.length === 0) {
    return <Navigate to={ROUTES.subscription.path} replace />;
  }

  if (
    subscription &&
    ((subscription.status === 'CANCELLED' && isExpired) || subscription.status === 'PENDING')
  ) {
    return <Navigate to={ROUTES.subscription.path} replace />;
  }

  return children;
};

export default SubscriptionGuard;

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { LicenseTier, LicenseInfoResponse } from '../types/license';
import { getLicenseInfo, activateLicense, deactivateLicense, recordTrialSession } from '../lib/ipc';

export interface LicenseContextType {
  tier: LicenseTier;
  isPro: boolean;
  trialUsed: number;
  trialMax: number;
  trialRemaining: number;
  customerEmail: string | null;
  deviceFingerprint: string;
  isLoading: boolean;
  isLicenseModalOpen: boolean;
  setIsLicenseModalOpen: (open: boolean) => void;
  upsellFeature: string | null;
  setUpsellFeature: (feature: string | null) => void;
  refreshLicense: () => Promise<void>;
  activate: (key: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  deactivate: () => Promise<{ success: boolean; error?: string }>;
  /**
   * Request permission to use a Pro feature (such as F2 inline edit or F3 split edit).
   * If user is Pro, always returns true.
   * If in trial, increments trial session counter and returns true while quota permits.
   * If trial exhausted, prompts license modal and returns false.
   */
  requestProFeature: (featureName: string) => Promise<boolean>;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export const LicenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<LicenseTier>('trial');
  const [isPro, setIsPro] = useState<boolean>(false);
  const [trialUsed, setTrialUsed] = useState<number>(0);
  const [trialMax, setTrialMax] = useState<number>(300);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);
  const [upsellFeature, setUpsellFeature] = useState<string | null>(null);

  const applyLicenseInfo = useCallback((info: LicenseInfoResponse) => {
    setTier(info.tier);
    setIsPro(info.isPro);
    setTrialUsed(info.trialUsed);
    setTrialMax(info.trialMax);
    setCustomerEmail(info.customerEmail);
    setDeviceFingerprint(info.deviceFingerprint);
  }, []);

  const refreshLicense = useCallback(async () => {
    try {
      const info = await getLicenseInfo();
      applyLicenseInfo(info);
    } catch (e) {
      console.warn('Failed to fetch license info:', e);
    } finally {
      setIsLoading(false);
    }
  }, [applyLicenseInfo]);

  useEffect(() => {
    refreshLicense();
  }, [refreshLicense]);

  const activate = useCallback(async (key: string) => {
    try {
      const res = await activateLicense(key);
      if (res.success) {
        await refreshLicense();
        return { success: true, message: res.message || 'Pro Edition activated!' };
      }
      return { success: false, error: res.error || 'Activation failed' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error during activation' };
    }
  }, [refreshLicense]);

  const deactivate = useCallback(async () => {
    try {
      const res = await deactivateLicense();
      if (res.success) {
        await refreshLicense();
        return { success: true };
      }
      return { success: false, error: res.error || 'Deactivation failed' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error during deactivation' };
    }
  }, [refreshLicense]);

  const requestProFeature = useCallback(async (featureName: string): Promise<boolean> => {
    if (isPro) {
      return true;
    }

    try {
      const trialRes = await recordTrialSession();
      if (trialRes.allowed) {
        setTrialUsed(trialMax - trialRes.remaining);
        return true;
      }
      // Trial exhausted
      setUpsellFeature(featureName);
      setIsLicenseModalOpen(true);
      return false;
    } catch (e) {
      console.warn('Error recording trial session:', e);
      // Fallback: don't block user on local error
      return true;
    }
  }, [isPro, trialMax]);

  const trialRemaining = Math.max(0, trialMax - trialUsed);

  return (
    <LicenseContext.Provider
      value={{
        tier,
        isPro,
        trialUsed,
        trialMax,
        trialRemaining,
        customerEmail,
        deviceFingerprint,
        isLoading,
        isLicenseModalOpen,
        setIsLicenseModalOpen,
        upsellFeature,
        setUpsellFeature,
        refreshLicense,
        activate,
        deactivate,
        requestProFeature,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export function useLicense(): LicenseContextType {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentMethod, PaymentMethodType } from '../types';

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod: PaymentMethod | null;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

// Dummy payment methods for development
const generateDummyPaymentMethods = (): PaymentMethod[] => {
  return [
    {
      id: '1',
      type: 'gopay',
      displayName: 'GoPay',
      accountNumber: '0812****5678',
      isDefault: true,
      icon: 'wallet',
    },
    {
      id: '2',
      type: 'dana',
      displayName: 'DANA',
      accountNumber: '0851****1234',
      isDefault: false,
      icon: 'credit-card',
    },
    {
      id: '3',
      type: 'bank_transfer',
      displayName: 'BCA',
      accountNumber: '****7890',
      isDefault: false,
      icon: 'bank',
    },
  ];
};

export const PaymentMethodProvider = ({ children }: { children: ReactNode }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    generateDummyPaymentMethods()
  );

  const defaultPaymentMethod = paymentMethods.find((m) => m.isDefault) || null;

  const addPaymentMethod = (methodData: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...methodData,
      id: Date.now().toString(),
    };

    // If this is the first payment method, make it default
    if (paymentMethods.length === 0) {
      newMethod.isDefault = true;
    }

    setPaymentMethods((prev) => [...prev, newMethod]);
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => {
      const filtered = prev.filter((m) => m.id !== id);

      // If we removed the default method, set another as default
      if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
        filtered[0].isDefault = true;
      }

      return filtered;
    });
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethods,
        defaultPaymentMethod,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  );
};

export const usePaymentMethod = () => {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error('usePaymentMethod must be used within PaymentMethodProvider');
  }
  return context;
};

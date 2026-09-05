"use client";

import React, { useState } from 'react';
import { X, Phone, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

interface Plan {
  id: string | number;
  name: string;
  price: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  onSuccessfulPayment: (message: string) => void;
  onPaymentCompleted?: (paymentData: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  onSuccessfulPayment,
  onPaymentCompleted,
}: PaymentModalProps) {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !selectedPlan) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.2:8080";
  const WS_URL = process.env.WS_URL || API_URL.replace(/^http/, 'ws') + '/ws-jemigraph';

  const handlePaySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Send payment initiation request to Spring Boot backend
      const response = await axios.post(
        `${API_URL}/payments/subscription/pay`,
        null,
        {
          params: {
            planId: selectedPlan.id,
            email: email,
            phoneNumber: phoneNumber,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const orderId = response.data.orderId || response.data.id;

      if (orderId) {
        // 2. Connect to STOMP WebSocket and subscribe to /topic/payment/{orderId}
        subscribeToPaymentWebSocket(orderId);
      }

      onSuccessfulPayment(
        response.data.message ||
          'Payment request has been sent to your phone. Please check and confirm.'
      );
      
      setEmail('');
      setPhoneNumber('');
      onClose();
    } catch (err: any) {
      // Safely extract Spring Boot error message structures (handles string, JSON object, or ResponseStatusException data)
      let errorMsg = 'An error occurred. Please try again.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (typeof err.response.data === 'object') {
          errorMsg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPaymentWebSocket = (orderId: string | number) => {
    console.log(`📡 Connecting to WebSocket at ${WS_URL}...`);

    const stompClient = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        const destination = `/topic/payment/${orderId}`;
        console.log(`📡 SUBSCRIBING TO => ${destination}`);

        stompClient.subscribe(destination, (message) => {
          console.log("📨 PAYMENT WEBSOCKET MESSAGE RECEIVED");
          console.log(`📨 BODY => ${message.body}`);

          if (!message.body) {
            console.log("⚠️ Empty WebSocket payment response");
            return;
          }

          try {
            const decoded = JSON.parse(message.body);
            console.log("✅ Parsed Payment Response:", decoded);

            if (onPaymentCompleted) {
              onPaymentCompleted(decoded);
            }

            stompClient.deactivate();
          } catch (e) {
            console.error("❌ Failed to parse payment WebSocket response:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ Broker reported error: " + frame.headers['message']);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.activate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative transform transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Complete Payment</h3>
          <p className="text-sm text-slate-500 mt-1">
            Selected Package:{' '}
            <span className="font-semibold text-[#357738]">
              {selectedPlan.name}
            </span>{' '}
            —{' '}
            <span className="font-bold">
              TZS {selectedPlan.price?.toLocaleString()}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handlePaySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your Account Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#357738] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#357738] focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enter mobile network number (e.g., 07..., 06...)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#357738] text-white py-3 rounded-lg font-semibold hover:bg-[#2d6430] transition flex items-center justify-center shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Processing payment request...
              </>
            ) : (
              'Confirm and Pay'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
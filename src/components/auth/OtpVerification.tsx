import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService } from '@/api/apiCalling';
import { useToast } from "@/components/ui/use-toast";
import { endpoints } from "@/api/endpoints";

interface OtpVerificationProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email: string;
  registrationData: any;
}

const OtpVerification = ({ open, onClose, onSuccess, email, registrationData }: OtpVerificationProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    if (!/^[0-9]*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter all 6 digits of the OTP",
      });
      return;
    }

    try {
      const response = await apiService.post(endpoints.verify, {
        email,
        code: otpString // Changed from 'otp' to 'code' to match backend VerifyRequest
      });

      if (response?.message === "Email verified successfully") {
        toast({
          title: "Success",
          description: response.message,
        });
        onSuccess();
      } else {
        // If we get a response but not a success message, show the error
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: response?.error || "Verification failed. Please try again.",
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.response?.data?.error || "Verification failed. Please try again.",
      });
    }
  };

  const handleResendOtp = async () => {
    if (isResending || timeLeft > 0) return;
    
    setIsResending(true);
    try {
      await apiService.post('/api/auth/resend-otp', { email });
      setTimeLeft(300); // Reset timer to 5 minutes
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Resend OTP",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit code sent to {email}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6">
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-2xl"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Time remaining: {formatTime(timeLeft)}
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Button onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
            <Button
              variant="outline"
              onClick={handleResendOtp}
              disabled={timeLeft > 0 || isResending}
            >
              {timeLeft > 0 ? `Resend OTP in ${formatTime(timeLeft)}` : 'Resend OTP'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerification;
import React, { useState } from "react";

import ContactStep from "./transaction-step/contact-step";
import PackageStep from "./transaction-step/package-step";
import PaymentAmmount from "./transaction-step/payment-ammount";
import SummaryStep from "./transaction-step/summary-step";

enum SENDER_STEPS {
  CONTACT = 0,
  FORM = 1,
  PACKAGE = 2,
  PAYMENT = 3,
  SUMMARY = 4,
}

interface SenderCreateTransactionModal {
  role?: "sender" | "reciever";
}
export default function SenderCreateTransactionModal({
  role,
}: SenderCreateTransactionModal) {
  const [step, setStep] = useState(SENDER_STEPS.CONTACT);
  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };
  const onContactSecondaryAction = () => {
    setStep((value) => value + 2);
  };

  const renderContent = () => {
    switch (step) {
      case SENDER_STEPS.CONTACT:
        return (
          <ContactStep
            role={role}
            onSubmit={onNext}
            secondaryAction={onContactSecondaryAction}
          />
        );
      case SENDER_STEPS.FORM:
        return (
          <ContactStep
            role={role}
            onSubmit={onNext}
            secondaryAction={onContactSecondaryAction}
          />
        );
      case SENDER_STEPS.PACKAGE:
        return <PackageStep role={role} onSubmit={onNext} onCancel={onBack} />;
      case SENDER_STEPS.PAYMENT:
        return (
          <PaymentAmmount role={role} onSubmit={onNext} onCancel={onBack} />
        );
      case SENDER_STEPS.SUMMARY:
        return <SummaryStep />;

      default:
        return null;
    }
  };

  return renderContent();
}

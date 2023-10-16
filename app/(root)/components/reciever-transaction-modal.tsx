import React, { useState } from "react";

import ContactStep from "./transaction-step/contact-step";
import PaymentAmmount from "./transaction-step/payment-ammount";
import SummaryStep from "./transaction-step/summary-step";

enum RECIEVER_STEPS {
  CONTACT = 0,
  BANK = 1,
  SUMMARY = 2,
}

interface RecieverCreateTransactionModalProps {
  role?: "sender" | "reciever";
  openForm: () => void;
}
export default function RecieverCreateTransactionModal({
  role,
}: RecieverCreateTransactionModalProps) {
  const [step, setStep] = useState(RECIEVER_STEPS.CONTACT);
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
      case RECIEVER_STEPS.CONTACT:
        return (
          <ContactStep
            role={role}
            onSubmit={onNext}
            secondaryAction={onContactSecondaryAction}
          />
        );
      case RECIEVER_STEPS.BANK:
        return (
          <PaymentAmmount role={role} onSubmit={onNext} onCancel={onBack} />
        );
      case RECIEVER_STEPS.SUMMARY:
        return <SummaryStep />;

      default:
        return null;
    }
  };

  return renderContent();
}

import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import React, { useState } from "react";

import ContactStep from "./transaction-step/contact-step";
import PackageStep from "./transaction-step/package-step";
import PaymentAmmount from "./transaction-step/payment-ammount";
import SummaryStep from "./transaction-step/summary-step";

enum SENDER_STEPS {
  CONTACT = 0,
  PACKAGE = 1,
  PAYMENT = 2,
  SUMMARY = 3,
}

interface SenderCreateTransactionModal {
  role?: "sender" | "reciever";
  openForm: () => void;
}
export default function SenderCreateTransactionModal({
  openForm,
}: SenderCreateTransactionModal) {
  const { setTransaction } = useCreateTransactionModal();
  const [step, setStep] = useState(SENDER_STEPS.CONTACT);

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const renderContent = () => {
    switch (step) {
      case SENDER_STEPS.CONTACT:
        return (
          <ContactStep
            onCancel={() => setTransaction({ role: undefined })}
            onSubmit={openForm}
            secondaryAction={onNext}
          />
        );
      case SENDER_STEPS.PACKAGE:
        return <PackageStep onSubmit={onNext} onCancel={onBack} />;
      case SENDER_STEPS.PAYMENT:
        return <PaymentAmmount onSubmit={onNext} onCancel={onBack} />;
      case SENDER_STEPS.SUMMARY:
        return <SummaryStep onSubmit={onNext} onCancel={onBack} />;

      default:
        return null;
    }
  };

  return renderContent();
}

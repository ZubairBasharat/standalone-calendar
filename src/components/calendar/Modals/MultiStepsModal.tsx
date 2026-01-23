import { useState } from "react";
import { Button } from "@/components/ui/button";
import SheetModal from "@/components/common/SheetModal";
import {
  BTN_CLASSES_Default,
  BTN_CLASSES_Secondary,
} from "@/components/common/ButtonColors";

interface MultiStepModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MultiStepModal({ open, setOpen }: MultiStepModalProps) {
  const totalSteps = 3;
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else setOpen(false); // Close modal on last step
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const close = () => {
    setOpen(false);
    setStep(1);
  };

  const progressWidth = `${(step / totalSteps) * 100}%`;

  return (
    <SheetModal
      open={open}
      onClose={close}
      header={
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Reassign Shifts
        </h2>
      }
      body={
        <div className="flex flex-col gap-4 px-4">
          {/* Progress Bar */}
          <div className=" flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm text-black">Select Shifts</div>
              <span className="text-sm text-gray-600">Step {step}/3</span>
            </div>
            <div className="w-full bg-gray-200 h-1">
              <div
                className="bg-custom-teal h-1 transition-all"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && <div>Content for Step 1</div>}
          {step === 2 && <div>Content for Step 2</div>}
          {step === 3 && <div>Content for Step 3</div>}
        </div>
      }
      footer={
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className={BTN_CLASSES_Default}
            variant="outline"
            onClick={close}
          >
            Cancel
          </Button>
          {step > 1 && (
            <Button
              className={BTN_CLASSES_Default}
              variant="outline"
              onClick={back}
            >
              Back
            </Button>
          )}
          <Button
            onClick={next}
            className={`${step < totalSteps ? BTN_CLASSES_Default : BTN_CLASSES_Secondary}`}
          >
            {step < totalSteps ? "Next" : "Finish"}
          </Button>
        </div>
      }
    />
  );
}

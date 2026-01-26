import { useState } from "react";
import { Button } from "@/components/ui/button";
import SheetModal from "@/components/common/SheetModal";
import {
  BTN_CLASSES_Default,
  BTN_CLASSES_Secondary,
} from "@/components/common/ButtonColors";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CircleAlert, Clock4, MapPin } from "lucide-react";

interface MultiStepModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const visits = [
  {
    id: 1,
    name: "John Smith",
    status: "Pending",
    date: "Mon, 13 Jan",
    time: "09:00 - 17:00",
    location: "2435",
  },
  {
    id: 2,
    name: "Emily Johnson",
    status: "Completed",
    date: "Tue, 14 Jan",
    time: "10:00 - 18:00",
    location: "1982",
  },
  {
    id: 3,
    name: "Michael Brown",
    status: "InProgress",
    date: "Wed, 15 Jan",
    time: "08:00 - 16:00",
    location: "3021",
  },
  {
    id: 4,
    name: "Bobby Brown",
    status: "Cancelled",
    date: "Wed, 15 Jan",
    time: "08:00 - 16:00",
    location: "3028",
  },
];

export default function MultiStepModal({ open, setOpen }: MultiStepModalProps) {
  const [selectedVisits, setSelectedVisits] = useState<number[]>([]);
  const [step, setStep] = useState(1);

  const totalSteps = 3;

  const isEligible = (status: string) =>
    status !== "Completed" && status !== "Cancelled";

  const eligibleVisits = visits
    .filter((v) => isEligible(v.status))
    .map((v) => v.id);

  const allSelected =
    eligibleVisits.length > 0 &&
    eligibleVisits.every((id) => selectedVisits.includes(id));

  const someSelected =
    eligibleVisits.some((id) => selectedVisits.includes(id)) && !allSelected;

  const toggleVisit = (id: number) => {
    setSelectedVisits((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedVisits((prev) =>
      allSelected
        ? prev.filter((id) => !eligibleVisits.includes(id))
        : eligibleVisits,
    );
  };

  const selectAllState: boolean | "indeterminate" = allSelected
    ? true
    : someSelected
      ? "indeterminate"
      : false;

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else close();
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const close = () => {
    setOpen(false);
    setStep(1);
    setSelectedVisits([]);
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
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-black">Select Shifts</div>
              <span className="text-sm text-gray-600">
                Step {step}/{totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1">
              <div
                className="bg-custom-teal h-1 transition-all"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAllState}
                  onCheckedChange={toggleSelectAll}
                />

                <p className="text-black dark:text-white">
                  Select all eligible visits
                </p>
              </div>

              {/* Alert */}
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-[4px] flex items-center p-4 gap-2">
                <CircleAlert className="w-5 h-5 text-amber-400" />
                <p className="text-[#92400E]">
                  Some visits are excluded and cannot be reassigned
                </p>
              </div>

              {/* Visits */}
              <div className="flex flex-col space-y-2">
                {visits.map((visit) => {
                  const eligible = isEligible(visit.status);
                  const selected = selectedVisits.includes(visit.id);

                  return (
                    <div
                      key={visit.id}
                      className={`flex items-start border rounded-[6px] px-5 py-4 ${
                        selected && eligible
                          ? "border-custom-teal"
                          : "border-gray-300"
                      } ${!eligible ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            disabled={!eligible}
                            checked={selected}
                            onCheckedChange={() => toggleVisit(visit.id)}
                          />

                          <p
                            className={`font-semibold text-black dark:text-white ${visit.status === "Cancelled" ? "line-through" : "normal-case"}`}
                          >
                            {visit.name}
                          </p>

                          <div
                            className={`px-1.5 py-0.75 rounded text-sm font-medium ${
                              visit.status === "Pending"
                                ? "bg-amber-50 text-amber-600"
                                : visit.status === "Cancelled"
                                  ? "bg-red-50 text-red-600"
                                  : visit.status === "InProgress"
                                    ? "bg-blue-100 text-blue-500"
                                    : "bg-gray-200 text-gray-500 opacity-60"
                            }`}
                          >
                            {visit.status}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-500 px-6">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <p
                              className={`${visit.status === "Cancelled" ? "line-through" : "normal-case"}`}
                            >
                              {visit.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock4 className="w-4 h-4" />
                            <p
                              className={`${visit.status === "Cancelled" ? "line-through" : "normal-case"}`}
                            >
                              {visit.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <p
                              className={`${visit.status === "Cancelled" ? "line-through" : "normal-case"}`}
                            >
                              {visit.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
            className={
              step < totalSteps ? BTN_CLASSES_Default : BTN_CLASSES_Secondary
            }
          >
            {step < totalSteps ? "Next" : "Finish"}
          </Button>
        </div>
      }
    />
  );
}

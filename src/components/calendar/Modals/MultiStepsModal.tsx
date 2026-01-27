import { useState } from "react";
import { Button } from "@/components/ui/button";
import SheetModal from "@/components/common/SheetModal";
import {
  BTN_CLASSES_Default,
  BTN_CLASSES_Secondary,
  BTN_CLASSES_Third,
} from "@/components/common/ButtonColors";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  CircleAlert,
  Clock4,
  Dot,
  Funnel,
  MapPin,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import SearchCarerDropdown from "@/components/SearchCareerDropdown";
import type { Client } from "@/helpers/common";
import type { PublishShiftWorkflowPayload } from "@/features/api/types";
import ActionCard from "@/components/ActionCard";

/* ---------------- Types ---------------- */

type VisitStatus = "Pending" | "Completed" | "InProgress" | "Cancelled";

interface Visit {
  id: number;
  name: string;
  status: VisitStatus;
  date: string;
  time: string;
  location: string;
  carerId: string;
}

type ActionType =
  | "moveToVacant"
  | "reassign"
  | "cancel"
  | "reverseCancellation";

interface WorkflowState {
  selectedVisitIds: number[];
  action: ActionType | null;
  cancelReason?: string;
  cancelComments?: string;
  targetCarerId?: number;
}

interface Carer {
  id: string;
  name: string;
  initials: string;
  status: string;
  hours: number;
}

const actionLabels: Record<string, string> = {
  moveToVacant: "Move to Vacant",
  cancel: "Cancel",
  reverseCancellation: "Reverse Cancellation",
};

/* ---------------- Dummy Data ---------------- */

const visits: Visit[] = [
  {
    id: 1,
    name: "John Smith",
    status: "Pending",
    date: "Mon, 13 Jan",
    time: "09:00 - 17:00",
    location: "2435",
    carerId: "20",
  },
  {
    id: 2,
    name: "Emily Johnson",
    status: "Completed",
    date: "Tue, 14 Jan",
    time: "10:00 - 18:00",
    location: "1982",
    carerId: "69",
  },
  {
    id: 3,
    name: "Michael Brown",
    status: "InProgress",
    date: "Wed, 15 Jan",
    time: "08:00 - 16:00",
    location: "3021",
    carerId: "59",
  },
  {
    id: 4,
    name: "BobbyBrown",
    status: "Cancelled",
    date: "Wed, 19 Jan",
    time: "18:00 - 20:00",
    location: "2390",
    carerId: "89",
  },
];

const carers: Carer[] = [
  {
    id: "1",
    name: "Makhdum",
    initials: "MK",
    status: "Last visit completed @ 15:00",
    hours: 8,
  },
  {
    id: "2",
    name: "Iqra Gfalid",
    initials: "IG",
    status: "Last visit completed @ 15:00",
    hours: 8,
  },
  {
    id: "3",
    name: "John Doe",
    initials: "JD",
    status: "Visit in progress",
    hours: 8,
  },
];

/* ---------------- Component ---------------- */

export default function MultiStepModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const totalSteps = 3;

  const [step, setStep] = useState(1);
  const [selectedVisits, setSelectedVisits] = useState<number[]>([]);

  const [carerDropdownOpen, setCarerDropdownOpen] = useState(false);
  const [carerSearch, setCarerSearch] = useState("");
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);

  const [workflow, setWorkflow] = useState<WorkflowState>({
    selectedVisitIds: [],
    action: null,
  });

  /* ---------------- Api Payload ---------------- */
  const buildPayload = (): PublishShiftWorkflowPayload | null => {
    if (!workflow.action) return null;

    switch (workflow.action) {
      case "reassign":
        return {
          action: "reassign",
          visitIds: workflow.selectedVisitIds,
          previousCarers: previousCarerNames,
          newCarer: {
            id: workflow.targetCarerId,
            name: selectedCarerName,
          },
        };

      case "cancel":
        return {
          action: "cancel",
          visitIds: workflow.selectedVisitIds,
          cancellation: {
            reason: workflow.cancelReason,
            comments: workflow.cancelComments,
          },
        };

      case "moveToVacant":
        return {
          action: "moveToVacant",
          visitIds: workflow.selectedVisitIds,
        };

      case "reverseCancellation":
        return {
          action: "reverseCancellation",
          visitIds: workflow.selectedVisitIds,
        };

      default:
        return null;
    }
  };

  /* ---------------- Visit Selection ---------------- */

  const eligibleVisits = visits
    .filter((v) => v.status !== "Completed")
    .map((v) => v.id);

  const allSelected =
    eligibleVisits.length > 0 &&
    eligibleVisits.every((id) => selectedVisits.includes(id));

  const toggleSelectAll = () => {
    setSelectedVisits(allSelected ? [] : eligibleVisits);
  };

  const toggleVisit = (id: number) => {
    setSelectedVisits((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const previousCarerNames = Array.from(
    new Set(
      workflow.selectedVisitIds
        .map((id) => visits.find((v) => v.id === id)?.name)
        .filter(Boolean),
    ),
  ).join(", ");

  function getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/) // split by spaces
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }

  /* ---------------- Navigation ---------------- */

  const next = () => {
    if (step === 1) {
      setWorkflow((prev) => ({
        ...prev,
        selectedVisitIds: selectedVisits,
      }));
    }

    if (step === 2 && workflow.action === "moveToVacant") {
      setStep(3);
      return;
    }

    if (step < totalSteps) setStep(step + 1);
  };

  const back = () => {
    if (step === 2) {
      setWorkflow((prev) => ({
        ...prev,
        action: null,
        cancelReason: undefined,
        cancelComments: undefined,
        targetCarerId: undefined,
      }));
    }

    if (step > 1) setStep(step - 1);
  };

  const close = () => {
    setOpen(false);
    setStep(1);
    setSelectedVisits([]);
    setSelectedClients([]);
    setWorkflow({ selectedVisitIds: [], action: null });
  };

  /* ---------------- Carer → Client Adapter ---------------- */

  const carerClients: Client[] = carers.map((c) => ({
    id: c.id,
    title: c.name,
    initials: c.initials,
    hours: c.hours,
    colorClass: "bg-teal-400 text-white",
    type: "carer",
  }));

  const filteredClients = carerClients.filter((c) =>
    c.title.toLowerCase().includes(carerSearch.toLowerCase()),
  );

  const selectedCarerName = workflow.targetCarerId
    ? carerClients.find((c) => c.id === String(workflow.targetCarerId))?.title
    : "Not selected";

  const toggleClientSelection = (client: Client) => {
    setSelectedClients([client]); // single select

    setWorkflow((prev) => ({
      ...prev,
      targetCarerId: Number(client.id),
    }));
  };

  const confirmCarerSelection = () => {
    const selectedCarerId = Number(selectedClients[0]?.id);

    if (!Number.isNaN(selectedCarerId)) {
      setWorkflow((prev) => ({
        ...prev,
        targetCarerId: selectedCarerId,
      }));
    }

    setCarerDropdownOpen(false);
    setCarerSearch("");
  };

  const selectedVisitObjects = visits.filter((v) =>
    selectedVisits.includes(v.id),
  );

  const allSelectedAreCancelled =
    selectedVisitObjects.length > 0 &&
    selectedVisitObjects.every((v) => v.status === "Cancelled");

  const hasNonCancelled = selectedVisitObjects.some(
    (v) => v.status !== "Cancelled",
  );
  const hasCancelled = selectedVisitObjects.some(
    (v) => v.status === "Cancelled",
  );

  const progressWidth = `${(step / totalSteps) * 100}%`;
  return (
    <SheetModal
      open={open}
      onClose={close}
      header={<h2 className="text-lg font-semibold">Reassign Visits</h2>}
      body={
        <>
          <div className="px-4 space-y-4">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm">
                <span>
                  {step === 1 && "Select Visits"}
                  {step === 2 && "Select Action"}
                  {step === 3 && "Review"}
                </span>
                <span>
                  Step {step}/{totalSteps}
                </span>
              </div>
              <div className="h-1 bg-gray-200 mt-2">
                <div
                  className="h-1 bg-custom-teal transition-all"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span>Select all eligible visits</span>
                </div>

                <div className="bg-yellow-50 border border-yellow-400 p-3 flex gap-2 rounded">
                  <CircleAlert className="text-yellow-500" />
                  <p className="text-sm">
                    Some visits are excluded and cannot be reassigned
                  </p>
                </div>
                <div className="flex flex-col space-y-2 overflow-y-auto max-h-[calc(100vh-340px)]">
                  {visits.map((v) => {
                    const eligible = v.status !== "Completed";
                    const selected = selectedVisits.includes(v.id);

                    return (
                      <div
                        key={v.id}
                        className={`border rounded p-4 ${
                          selected ? "border-custom-teal" : "border-gray-300"
                        } ${!eligible && "opacity-60"}`}
                      >
                        <div className="flex gap-2 items-center">
                          <Checkbox
                            disabled={!eligible}
                            checked={selected}
                            onCheckedChange={() => toggleVisit(v.id)}
                          />
                          <span
                            className={`font-semibold text-black dark:text-white ${v.status === "Cancelled" ? "line-through" : "normal-case"}`}
                          >
                            {v.name}
                          </span>
                          <div
                            className={`px-1.5 py-0.75 rounded text-sm font-medium ${
                              v.status === "Pending"
                                ? "bg-amber-50 text-amber-600"
                                : v.status === "Cancelled"
                                  ? "bg-red-50 text-red-600"
                                  : v.status === "InProgress"
                                    ? "bg-blue-50 text-blue-500"
                                    : "bg-gray-200 text-gray-500 opacity-60"
                            }`}
                          >
                            {v.status}
                          </div>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-500 mt-2 pl-6">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            <p
                              className={`${v.status === "Cancelled" ? "line-through" : "normal-case"}`}
                            >
                              {v.time}
                            </p>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock4 size={14} />
                            <p
                              className={`${v.status === "Cancelled" ? "line-through" : "normal-case"}`}
                            >
                              {v.time}
                            </p>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            <p
                              className={`${v.status === "Cancelled" ? "line-through" : "normal-case"}`}
                            >
                              {v.location}
                            </p>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                {/* IF ACTION NOT SELECTED YET */}
                {!workflow.action && (
                  <>
                    <p className="text-sm text-black">
                      What do you want to do with the selected shifts?
                    </p>

                    <ActionCard
                      title="Move to Vacant"
                      description="Move selected shifts to Vacant Shifts row."
                      selected={workflow.action === "moveToVacant"}
                      onClick={() => {
                        setWorkflow((p) => ({ ...p, action: "moveToVacant" }));
                      }}
                      disabled={allSelectedAreCancelled || hasCancelled}
                    />

                    <ActionCard
                      title="Reassign Visits"
                      description="Select another carer."
                      selected={workflow.action === "reassign"}
                      onClick={() =>
                        setWorkflow((p) => ({ ...p, action: "reassign" }))
                      }
                      disabled={allSelectedAreCancelled || hasCancelled}
                    />

                    <ActionCard
                      title="Cancel Visits"
                      description="Choose reason + comments."
                      selected={workflow.action === "cancel"}
                      onClick={() =>
                        setWorkflow((p) => ({ ...p, action: "cancel" }))
                      }
                      disabled={allSelectedAreCancelled || hasCancelled}
                    />

                    <ActionCard
                      title="Reverse Cancellation"
                      description="Re-activate cancelled visits."
                      selected={workflow.action === "reverseCancellation"}
                      onClick={() => {
                        if (!allSelectedAreCancelled) return;
                        setWorkflow((p) => ({
                          ...p,
                          action: "reverseCancellation",
                        }));
                      }}
                      disabled={!allSelectedAreCancelled}
                    />
                    {hasNonCancelled && (
                      <div className="bg-red-50 border border-red-400 p-3 rounded flex gap-2">
                        <CircleAlert className="text-red-500 h-8 w-8" />
                        <p className="text-xs text-red-600">
                          Reverse cancellation is only allowed when all selected
                          visits are cancelled. Other actions are allowed only
                          when no "Cancelled" visits are selected.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {workflow.action === "moveToVacant" && (
                  <div className="border rounded p-4 bg-gray-50">
                    <p className="font-medium text-black">
                      Move selected visits to Vacant Shifts
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Click “Next” to review and confirm.
                    </p>
                  </div>
                )}

                {workflow.action === "reassign" && (
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <div className="border w-[90%] rounded">
                        <SearchCarerDropdown
                          open={carerDropdownOpen}
                          setOpen={setCarerDropdownOpen}
                          setSearch={setCarerSearch}
                          users={filteredClients}
                          selected={selectedClients}
                          onSelect={toggleClientSelection}
                          onClose={() => {
                            setCarerDropdownOpen(false);
                            setCarerSearch("");
                          }}
                          onConfirm={confirmCarerSelection}
                        />
                      </div>
                      <Button
                        className={`w-[10%] text-black hover:text-white ${BTN_CLASSES_Secondary}`}
                      >
                        <Funnel className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="flex flex-col space-y-4">
                      {filteredClients.map((client) => {
                        const selected = selectedClients.some(
                          (c) => c.id === client.id,
                        );

                        return (
                          <div
                            key={client.id}
                            className={`flex items-center justify-between p-3 border rounded cursor-pointer bg-card ${
                              selected
                                ? "border-custom-teal"
                                : "border-gray-300"
                            }`}
                            onClick={() => toggleClientSelection(client)}
                          >
                            <div className="flex flex-row items-center gap-3">
                              {/* Avatar */}
                              <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold ${Number(client.id) % 2 === 1 ? client.colorClass : "bg-amber-400 text-white"}`}
                              >
                                {client.initials}
                              </div>

                              {/* Name */}
                              <div>
                                <p className="text-sm font-medium text-black">
                                  {client.title}
                                </p>
                                <div className="flex items-center space-x-2 h-max">
                                  <p className="text-xs text-gray-500">
                                    {client.hours} hrs
                                  </p>
                                  <div className="flex items-center">
                                    <Dot />
                                    <Button className="text-xs text-custom-teal bg-transparent px-0 py-0 hover:bg-transparent">
                                      View availability
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {workflow.action === "cancel" && (
                  <>
                    <p className="text-base font-semibold text-black dark:text-white">
                      Cancellation Reason
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "On arrival",
                        "24 hour cancellation",
                        "48 hour cancellation",
                        "Hospital",
                      ].map((reason) => (
                        <Button
                          key={reason}
                          variant={"outline"}
                          onClick={() =>
                            setWorkflow((p) => ({ ...p, cancelReason: reason }))
                          }
                          className={`px-5 py-2 rounded-full border text-sm bg-card text-black ${
                            workflow.cancelReason === reason
                              ? "border-custom-teal bg-teal-50 text-custom-teal"
                              : "border-gray-300"
                          }`}
                        >
                          {reason}
                        </Button>
                      ))}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-black dark:text-white">
                        Comments
                      </Label>
                      <textarea
                        className="w-full mt-2 p-3 border rounded resize-none"
                        placeholder="Enter cancellation comments..."
                        rows={4}
                        value={workflow.cancelComments || ""}
                        onChange={(e) =>
                          setWorkflow((p) => ({
                            ...p,
                            cancelComments: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                {workflow.action === "reverseCancellation" && (
                  <div className="border rounded p-4 bg-gray-50">
                    <p className="font-medium text-black">
                      Reverse Cancellation of the Shifts
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Click “Next” to review and confirm.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-col border border-custom-teal bg-teal-50 p-4 rounded">
                  <p className="font-semibold text-base text-black dark:text-white">
                    Review{" "}
                    {workflow.action === "moveToVacant"
                      ? "Move to Vacant"
                      : workflow.action === "reassign"
                        ? "Assignment"
                        : workflow.action === "cancel"
                          ? "Cancellation"
                          : workflow.action === "reverseCancellation"
                            ? "Reverse Cancellation"
                            : "Unknown"}
                  </p>
                  <div className="flex items-center justify-between space-y-.5 my-1">
                    <p className="text-sm">Selected visits:</p>
                    <p className="text-sm text-black dark:text-white font-medium">
                      {workflow.selectedVisitIds.length} Shifts
                    </p>
                  </div>
                  {workflow.action && actionLabels[workflow.action] && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Action:</p>
                      <p className="text-sm text-black dark:text-white font-medium">
                        {actionLabels[workflow.action]}
                      </p>
                    </div>
                  )}
                  {workflow.action === "reassign" && (
                    <>
                      <div className="flex flex-col gap-1 bg-card my-2 py-3 px-2 rounded border border-gray-200 text-sm text-gray-500">
                        <div className="flex items-center justify-between">
                          <p>Previous carer:</p>
                          <div className="flex flex-row items-center gap-2">
                            <div className="h-5 w-5 p-3.5 rounded-full bg-blue-300 text-white flex justify-center items-center text-xs">
                              <p>{getInitials(previousCarerNames)}</p>
                            </div>
                            <p className="text-sm font-medium">
                              {previousCarerNames || "Not available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Checkbox />
                          <p>add as shift drop in carer profile.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">New carer:</p>
                        {workflow.targetCarerId && selectedCarerName ? (
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 p-3.5 rounded-full bg-red-500 text-white flex justify-center items-center text-xs">
                              <p>{getInitials(selectedCarerName)}</p>
                            </div>
                            <p className="text-sm text-black dark:text-white font-medium">
                              {selectedCarerName}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Not selected</p>
                        )}
                      </div>
                    </>
                  )}

                  {workflow.action === "cancel" && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <p>Cancellation reason:</p>
                      <span className="text-sm text-black font-medium">
                        {workflow.cancelReason}
                      </span>
                    </div>
                  )}
                  {workflow.action === "cancel" && workflow.cancelComments && (
                    <div className="flex items-center justify-between bg-card my-2 py-3 px-2 rounded border border-gray-200 text-sm text-gray-500">
                      <p>{workflow.cancelComments}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col ">
                  {workflow.selectedVisitIds ? (
                    <>
                      <p className="text-sm text-black dark:text-white font-medium">
                        Selected visits:
                      </p>
                      <div className="space-y-2 py-2 overflow-y-auto max-h-[calc(100vh-340px)]">
                        {workflow.selectedVisitIds.map((id) => {
                          const v = visits.find((x) => x.id === id)!;
                          return (
                            <div key={id} className="border p-3 rounded">
                              <p className="font-medium">{v.name}</p>
                              <p className="text-sm text-gray-500">
                                {v.date} · {v.time}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-black dark:text-white font-medium">
                        No visits selected
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
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
            className={BTN_CLASSES_Third}
            disabled={
              (step === 2 &&
                workflow.action === "cancel" &&
                !workflow.cancelReason) ||
              (step === 2 &&
                workflow.action === "reassign" &&
                !workflow.targetCarerId)
            }
            onClick={() => {
              if (step === 3) {
                const payload = buildPayload();
                console.log("Payload", payload);
                close();
                return;
              }

              next();
            }}
          >
            {step === 3 ? "Save" : step === 2 ? "Next : Review" : "Next"}
          </Button>
        </div>
      }
    />
  );
}

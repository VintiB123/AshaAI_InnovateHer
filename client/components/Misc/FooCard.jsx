"use client";

import React from "react";
import { useOnborda } from "onborda";
import { ArrowRight, ArrowLeft, X } from "lucide-react";

export const TourCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  const { closeOnborda } = useOnborda();

  const handleClose = () => {
    closeOnborda();
    console.log("Closed onborda");
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full relative z-50">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close tour"
      >
        <X size={18} className="text-gray-500" />
      </button>

      {/* Step indicator */}
      <div className="text-sm text-gray-500 mb-2">
        Step {currentStep + 1} of {totalSteps}
      </div>

      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{step.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
      </div>

      {/* Content */}
      <p className="text-gray-600 mb-6">{step.content}</p>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <div>
          {currentStep !== 0 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
          )}
        </div>

        <div>
          {currentStep + 1 !== totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              🎉 Finish Tour
            </button>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="absolute text-white">{arrow}</div>
    </div>
  );
};

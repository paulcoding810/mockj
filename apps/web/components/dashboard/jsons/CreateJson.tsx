"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@mockj/shared-react/trpc";
import { zNewJsonRequestSchema } from "@mockj/shared/types/jsons";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/button";
import { useState } from "react";

type Inputs = z.infer<typeof zNewJsonRequestSchema>;

export default function CreateJson() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = trpc.jsons.createJson.useMutation({
    onSuccess(data, variables, context) {
      console.log("Json created successfully:", data);
      router.push(`/${data.id}`);
    },
    onError(error, variables, context) {
      console.error("Error creating json:", error);
      alert(
        `Error creating JSON mock: ${error.message || "An unexpected error occurred"}`
      );
      setIsSubmitting(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(zNewJsonRequestSchema),
  });

  const jsonValue = watch("json");
  const isValidJson = jsonValue
    ? (() => {
        try {
          JSON.parse(jsonValue);
          return true;
        } catch {
          return false;
        }
      })()
    : true;

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsSubmitting(true);
    mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="json"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            JSON Content
          </label>
          <div className="relative">
            <textarea
              id="json"
              className={`
                block w-full rounded-lg border px-4 py-3 text-sm font-mono
                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  errors.json
                    ? "border-red-300 bg-red-50 focus:ring-red-500 dark:border-red-600 dark:bg-red-900/20"
                    : "border-gray-300 bg-white focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                }
                ${!isValidJson && jsonValue ? "border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20" : ""}
              `}
              rows={12}
              placeholder='{"message": "Hello, World!", "status": "success"}'
              {...register("json", { required: true, maxLength: 3000 })}
            />
            {jsonValue && (
              <div className="absolute top-3 right-3">
                {isValidJson ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-medium">Valid JSON</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-medium">Invalid JSON</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {errors.json && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.json.type === "required"
                ? "JSON content is required"
                : errors.json.message || "Please enter valid JSON content"}
            </p>
          )}

          {!isValidJson && jsonValue && (
            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
              The JSON appears to be invalid. Please check your syntax.
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Maximum 3000 characters. Use valid JSON syntax.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {jsonValue
              ? `${jsonValue.length}/3000 characters`
              : "0/3000 characters"}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !jsonValue || !isValidJson}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              "Create Mock"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

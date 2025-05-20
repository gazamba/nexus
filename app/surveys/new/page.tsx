"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  createNextPipelineProgress,
  getPipelineData,
} from "@/lib/services/pipeline-service";
import { useAuth } from "@/contexts/auth-provider";
import { questions } from "../constants";
import { getClientId } from "@/lib/services/client-service";
import { v4 as uuidv4 } from "uuid";

export default function SurveyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string>("");
  const pipelineGroups: Record<string, any[]> = {};

  useEffect(() => {
    if (!user?.id) return;
    const fetchClientId = async () => {
      const clientId = await getClientId(user.id);
      setClientId(clientId);
    };
    fetchClientId();
    setLoading(true);
    const fetchPipelineData = async () => {
      const { data } = await getPipelineData(user.id);
      console.log(`responses: ${JSON.stringify(data, null, 2)}`);
      setResponses((prev) => ({
        ...prev,
        client_id: clientId,
      }));

      setPipelineData(data);
      setLoading(false);
    };
    fetchPipelineData();
  }, [user?.id]);

  for (const step of pipelineData) {
    const groupId = step.progress?.pipeline_group_id;
    if (!groupId) continue;
    if (!pipelineGroups[groupId]) pipelineGroups[groupId] = [];
    pipelineGroups[groupId].push(step);
  }

  let hasActivePipeline = false;
  for (const groupId in pipelineGroups) {
    const steps = pipelineGroups[groupId];
    const lastStep = steps.reduce((prev, curr) =>
      prev.step_order > curr.step_order ? prev : curr
    );
    if (lastStep?.progress?.status !== "completed") {
      hasActivePipeline = true;
      break;
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
        <span>Loading...</span>
      </div>
    );
  }

  if (hasActivePipeline) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-2xl mx-auto text-center text-lg text-muted-foreground border rounded-lg p-8 bg-muted">
          Pipeline is already in progress for workflow survey.
        </div>
      </div>
    );
  }

  const handleTextChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    setResponses((prev) => {
      const currentValues = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentValues, option],
        };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((item: string) => item !== option),
        };
      }
    });
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      toast({
        title: "Required field",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      toast({
        title: "Required field",
        description: "Please answer this question before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit the survey.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pipeline_group_id = uuidv4();
      let surveyData: Record<string, any> = {
        ...responses,
        user_id: user.id,
        client_id: clientId,
        pipeline_group_id,
      };

      await createNextPipelineProgress(user.id, clientId, pipeline_group_id);

      const followUpMap = [
        { main: "systems", other: "systems_other" },
        { main: "triggers", other: "triggers_other" },
        { main: "pain_points", other: "pain_points_other" },
        { main: "outputs", other: "outputs_other" },
        { main: "workflow_type", other: "workflow_type_other" },
        { main: "api_access", other: "api_access_details" },
      ];
      followUpMap.forEach(({ main, other }) => {
        if (
          Array.isArray(surveyData[main]) &&
          surveyData[main].includes("Other") &&
          surveyData[other]
        ) {
          surveyData[main] = [
            ...surveyData[main].filter((s: string) => s !== "Other"),
            surveyData[other],
          ];
          delete surveyData[other];
        } else if (
          typeof surveyData[main] === "string" &&
          surveyData[main] === "Other" &&
          surveyData[other]
        ) {
          surveyData[main] = surveyData[other];
          delete surveyData[other];
        }
      });
      surveyData.user_id = user.id;

      console.log(JSON.stringify(surveyData, null, 2));

      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit survey");
      }

      const surveyResponse = await response.json();
      console.log(`surveyResponse: ${JSON.stringify(surveyResponse, null, 2)}`);
      if (!surveyResponse.data.id) {
        throw new Error("Survey response ID not returned from API");
      }

      toast({
        title: "Survey submitted",
        description: "Thank you for completing the survey.",
      });

      await createNextPipelineProgress(user.id, clientId, pipeline_group_id);

      const analyzeRes = await fetch(
        `/api/surveys/${surveyResponse.data.id}/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(analyzeRes);
      if (!analyzeRes.ok) {
        const errorData = await analyzeRes.json();
        throw new Error(errorData.error || "Failed to analyze survey response");
      }
      const analyzedSurveyResponse = await analyzeRes.json();

      console.log(analyzedSurveyResponse);

      const insertRes = await fetch(`/api/surveys/${surveyResponse.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyzedSurveyResponse: analyzedSurveyResponse,
        }),
      });

      if (!insertRes.ok) {
        const errorData = await insertRes.json();
        throw new Error(errorData.error || "Failed to update survey response");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Submission failed",
        description:
          "There was an error submitting your survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="container py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Workflow Automation Survey</CardTitle>
          <p className="text-muted-foreground mt-2">
            Help us understand your workflow needs so we can create the best
            automation solution for you.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentStep + 1} of {questions.length}
              </span>
              {currentQuestion.required && (
                <span className="text-red-500">* Required</span>
              )}
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{
                  width: `${((currentStep + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === "text" && (
              <Input
                value={responses[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleTextChange(currentQuestion.id, e.target.value)
                }
                placeholder="Your answer"
              />
            )}

            {currentQuestion.type === "textarea" && (
              <Textarea
                value={responses[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleTextChange(currentQuestion.id, e.target.value)
                }
                placeholder="Your answer"
                rows={5}
              />
            )}

            {currentQuestion.type === "radio" && currentQuestion.options && (
              <RadioGroup
                value={responses[currentQuestion.id] || ""}
                onValueChange={(value) =>
                  handleTextChange(currentQuestion.id, value)
                }
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${currentQuestion.id}-${option}`}
                    />
                    <Label htmlFor={`${currentQuestion.id}-${option}`}>
                      {option}
                    </Label>
                  </div>
                ))}
                {currentQuestion.followUp?.id &&
                  responses[currentQuestion.id] === "Other" && (
                    <Input
                      value={responses[currentQuestion.followUp.id] || ""}
                      onChange={(e) =>
                        handleTextChange(
                          currentQuestion.followUp?.id!,
                          e.target.value
                        )
                      }
                      placeholder={
                        currentQuestion.followUp?.question || "Please specify"
                      }
                      className="mt-2"
                    />
                  )}
              </RadioGroup>
            )}

            {currentQuestion.type === "checkbox" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${currentQuestion.id}-${option}`}
                      checked={(responses[currentQuestion.id] || []).includes(
                        option
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          currentQuestion.id,
                          option,
                          checked === true
                        )
                      }
                    />
                    <Label htmlFor={`${currentQuestion.id}-${option}`}>
                      {option}
                    </Label>
                  </div>
                ))}
                {currentQuestion.followUp?.id &&
                  (responses[currentQuestion.id] || []).includes("Other") && (
                    <Input
                      value={responses[currentQuestion.followUp.id] || ""}
                      onChange={(e) =>
                        handleTextChange(
                          currentQuestion.followUp?.id!,
                          e.target.value
                        )
                      }
                      placeholder={
                        currentQuestion.followUp?.question || "Please specify"
                      }
                      className="mt-2"
                    />
                  )}
              </div>
            )}

            {currentQuestion.type === "scale" && (
              <div className="flex justify-between items-center mt-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <Button
                      variant={
                        responses[currentQuestion.id] === value.toString()
                          ? "default"
                          : "outline"
                      }
                      className="h-12 w-12 rounded-full"
                      onClick={() =>
                        handleTextChange(currentQuestion.id, value.toString())
                      }
                    >
                      {value}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep < questions.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

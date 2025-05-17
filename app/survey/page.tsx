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
  getPipelineData,
  advancePipelineStep,
} from "@/lib/services/pipeline-service";
import { useAuth } from "@/contexts/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { createSurvey } from "@/lib/services/survey-service";

type QuestionType = "text" | "textarea" | "radio" | "checkbox" | "scale";

interface SurveyQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  followUp?: {
    id: string;
    type: QuestionType;
    question: string;
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    condition: {
      field: string;
      value: string | string[];
    };
  };
}

export default function SurveyPage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const fetchPipelineData = async () => {
      const { data } = await getPipelineData(user.id);
      setPipelineData(data);
      setLoading(false);
    };
    fetchPipelineData();
  }, [user?.id]);

  const isInitialSurveyCompleted =
    pipelineData.find((step) => step.step_name === "Discovery: Initial Survey")
      ?.progress?.status === "completed";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></span>
        <span>Loading...</span>
      </div>
    );
  }

  if (isInitialSurveyCompleted) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-2xl mx-auto text-center text-lg text-muted-foreground border rounded-lg p-8 bg-muted">
          Pipeline is already in progress for workflow survey.
        </div>
      </div>
    );
  }

  const questions: SurveyQuestion[] = [
    {
      id: "workflow_type",
      type: "radio",
      question: "Which type of workflow do you want to automate?",
      options: [
        "Invoice Processing",
        "Customer Service",
        "HR Onboarding",
        "Recruitment",
        "Data Entry",
        "Inventory Management",
        "Other",
      ],
      required: true,
      followUp: {
        id: "workflow_type_other",
        type: "text",
        question: "Please specify the workflow type:",
        required: true,
        condition: { field: "workflow_type", value: "Other" },
      },
    },
    {
      id: "current_process",
      type: "textarea",
      question:
        "Describe the current workflow step-by-step, including who is involved, what tools are used, and how data flows between steps:",
      required: true,
      placeholder:
        "E.g., '1. Receive invoice via email. 2. Manually enter data into Salesforce. 3. Approve in Ariba. 4. Notify team via Slack.'",
    },
    {
      id: "triggers",
      type: "checkbox",
      question: "What events should trigger this workflow?",
      options: [
        "New email received",
        "Form submission",
        "API call or webhook",
        "Scheduled time (e.g., daily)",
        "Manual trigger",
        "Other",
      ],
      required: true,
      followUp: {
        id: "triggers_other",
        type: "text",
        question: "Please specify the trigger:",
        required: true,
        condition: { field: "triggers", value: "Other" },
      },
    },
    {
      id: "pain_points",
      type: "checkbox",
      question: "What challenges do you face in this workflow?",
      options: [
        "Time-consuming manual data entry",
        "Frequent data errors or inconsistencies",
        "Lack of real-time visibility or tracking",
        "Delays in approvals or processing",
        "Poor communication between teams",
        "Difficulty integrating systems",
        "Other",
      ],
      required: true,
      followUp: {
        id: "pain_points_other",
        type: "text",
        question: "Please describe the other challenge:",
        required: true,
        condition: { field: "pain_points", value: "Other" },
      },
    },
    {
      id: "systems",
      type: "checkbox",
      question: "Which systems or tools are currently used in this workflow?",
      options: [
        "Email (Gmail, Outlook, etc.)",
        "Salesforce",
        "SAP",
        "Ariba",
        "Bill.com",
        "Kronos",
        "Microsoft Office (Excel, Word, etc.)",
        "Google Workspace (Sheets, Docs, etc.)",
        "Slack",
        "Custom internal systems or APIs",
        "Other",
      ],
      required: true,
      followUp: {
        id: "systems_other",
        type: "text",
        question: "Please specify the other system or tool:",
        required: true,
        condition: { field: "systems", value: "Other" },
      },
    },
    {
      id: "api_access",
      type: "radio",
      question:
        "Do you have API access or credentials for the systems involved?",
      options: [
        "Yes, for all systems",
        "Yes, for some systems",
        "No",
        "Unsure",
      ],
      required: true,
      followUp: {
        id: "api_access_details",
        type: "textarea",
        question:
          "Please provide details (e.g., which systems, types of API access):",
        required: true,
        condition: {
          field: "api_access",
          value: ["Yes, for all systems", "Yes, for some systems"],
        },
      },
    },
    {
      id: "outputs",
      type: "checkbox",
      question:
        "What outputs or actions should the automated workflow produce?",
      options: [
        "Update a system (e.g., Salesforce, Ariba)",
        "Send notifications (e.g., email, Slack)",
        "Generate reports or files",
        "Trigger another workflow",
        "Interact with users (e.g., via chat or email)",
        "Other",
      ],
      required: true,
      followUp: {
        id: "outputs_other",
        type: "text",
        question: "Please specify the other output or action:",
        required: true,
        condition: { field: "outputs", value: "Other" },
      },
    },
    {
      id: "agent_interaction",
      type: "checkbox",
      question:
        "If user interaction is needed, which communication channels should the workflow support?",
      options: [
        "Chat (e.g., web interface)",
        "Email",
        "Slack",
        "Phone or SMS",
        "Video call",
        "None",
      ],
      required: true,
    },
    {
      id: "volume",
      type: "radio",
      question: "What is the approximate monthly volume of this workflow?",
      options: [
        "Less than 100 instances",
        "100-500 instances",
        "500-1,000 instances",
        "More than 1,000 instances",
      ],
      required: true,
    },
    {
      id: "priority",
      type: "scale",
      question: "How critical is automating this workflow? (1 = Low, 5 = High)",
      min: 1,
      max: 5,
      required: true,
    },
    {
      id: "additional_info",
      type: "textarea",
      question:
        "Any additional details about the workflow or automation preferences?",
      required: false,
      placeholder:
        "E.g., specific compliance requirements, preferred vendors, or constraints.",
    },
  ];

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
      const surveyData = {
        ...responses,
        user_id: user.id,
      };

      console.log("Survey data with user_id:", surveyData);

      const { error } = await createSurvey(surveyData);

      if (error) {
        throw error;
      }

      await advancePipelineStep(user.id, 1, 2);

      toast({
        title: "Survey submitted",
        description: "Thank you for completing the survey.",
      });

      router.push("/survey/thank-you");
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

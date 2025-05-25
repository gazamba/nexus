"use client";

import { useEffect, useState } from "react";
import {
  ServiceSidebar,
  type ThirdPartyService,
} from "@/components/credentials/service-sidebar";
import {
  CredentialForm,
  type CredentialField,
  type ServiceCredentials,
} from "@/components/credentials/credential-form";
import { Cloud, Diamond, Github, Slack, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-provider";
import { getClientId } from "@/lib/services/client-service";

const initialServices: ThirdPartyService[] = [
  {
    id: "slack",
    name: "Slack",
    icon: <Slack className="w-5 h-5" />,
    connected: true,
  },
  {
    id: "github",
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    connected: false,
  },
  {
    id: "jira",
    name: "Jira",
    icon: <Diamond className="w-5 h-5 text-blue-600" />,
    connected: false,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: <Cloud className="w-5 h-5 text-blue-500" />,
    connected: false,
  },
  {
    id: "aws",
    name: "AWS",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    connected: false,
  },
];

const serviceCredentials: Record<string, ServiceCredentials> = {
  slack: {
    id: "slack",
    name: "Slack",
    icon: <Slack className="w-6 h-6" />,
    connected: true,
    fields: [
      {
        id: "workspace_url",
        label: "Workspace URL",
        type: "url",
        value: "acme-corp.slack.com",
        placeholder: "your-workspace.slack.com",
        required: true,
      },
      {
        id: "bot_token",
        label: "Bot User OAuth Token",
        type: "password",
        value: "xoxb-************",
        placeholder: "xoxb-your-bot-token",
        required: true,
        masked: true,
      },
      {
        id: "signing_secret",
        label: "Signing Secret",
        type: "password",
        value: "********",
        placeholder: "Your signing secret",
        required: true,
        masked: true,
      },
    ],
  },
  github: {
    id: "github",
    name: "GitHub",
    icon: <Github className="w-6 h-6" />,
    connected: false,
    fields: [
      {
        id: "personal_token",
        label: "Personal Access Token",
        type: "password",
        value: "",
        placeholder: "ghp_xxxxxxxxxxxxxxxxxxxx",
        required: true,
      },
      {
        id: "organization",
        label: "Organization",
        type: "text",
        value: "",
        placeholder: "your-organization",
        required: false,
      },
    ],
  },
  jira: {
    id: "jira",
    name: "Jira",
    icon: <Diamond className="w-6 h-6 text-blue-600" />,
    connected: false,
    fields: [
      {
        id: "domain",
        label: "Jira Domain",
        type: "url",
        value: "",
        placeholder: "your-domain.atlassian.net",
        required: true,
      },
      {
        id: "email",
        label: "Email",
        type: "text",
        value: "",
        placeholder: "user@example.com",
        required: true,
      },
      {
        id: "api_token",
        label: "API Token",
        type: "password",
        value: "",
        placeholder: "Your Jira API token",
        required: true,
      },
    ],
  },
  salesforce: {
    id: "salesforce",
    name: "Salesforce",
    icon: <Cloud className="w-6 h-6 text-blue-500" />,
    connected: false,
    fields: [
      {
        id: "instance_url",
        label: "Instance URL",
        type: "url",
        value: "",
        placeholder: "https://your-instance.salesforce.com",
        required: true,
      },
      {
        id: "client_id",
        label: "Client ID",
        type: "text",
        value: "",
        placeholder: "Your connected app client ID",
        required: true,
      },
      {
        id: "client_secret",
        label: "Client Secret",
        type: "password",
        value: "",
        placeholder: "Your connected app client secret",
        required: true,
      },
    ],
  },
  aws: {
    id: "aws",
    name: "AWS",
    icon: <Zap className="w-6 h-6 text-orange-500" />,
    connected: false,
    fields: [
      {
        id: "access_key",
        label: "Access Key ID",
        type: "text",
        value: "",
        placeholder: "AKIAIOSFODNN7EXAMPLE",
        required: true,
      },
      {
        id: "secret_key",
        label: "Secret Access Key",
        type: "password",
        value: "",
        placeholder: "Your secret access key",
        required: true,
      },
      {
        id: "region",
        label: "Default Region",
        type: "text",
        value: "",
        placeholder: "us-east-1",
        required: true,
      },
    ],
  },
};

export default function CredentialsPage() {
  const { toast } = useToast();
  const [services, setServices] =
    useState<ThirdPartyService[]>(initialServices);
  const [selectedService, setSelectedService] = useState<string | null>(
    "slack"
  );
  const [clientId, setClientId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (user?.id) {
      getClientId(user.id).then((clientId) => {
        setClientId(clientId);
      });
    }
  }, [user?.id]);

  console.log(`clientId: ${clientId}`);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleSaveCredentials = async (
    serviceId: string,
    fields: CredentialField[]
  ) => {
    serviceCredentials[serviceId].fields = fields;

    const allRequiredFieldsFilled = fields
      .filter((field) => field.required)
      .every((field) => field.value.trim() !== "");

    setServices(
      services.map((service) =>
        service.id === serviceId
          ? { ...service, connected: allRequiredFieldsFilled }
          : service
      )
    );

    if (!clientId) {
      return;
    }

    console.log(`selectedService: ${selectedService}`);

    for (const field of fields) {
      try {
        if (field.type === "password") {
          let secretName = `${selectedService}_${field.id}_${Date.now()}`;
          console.log(`secretName: ${secretName}`);
          const response = await fetch("/api/credentials/secret", {
            method: "POST",
            body: JSON.stringify({
              secretName: secretName,
              secretKey: field.value,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const vaultKey = await response.json();

          await fetch("/api/credentials", {
            method: "POST",
            body: JSON.stringify({
              client_id: clientId,
              provider: selectedService,
              variable_name: field.id,
              vault_key: vaultKey,
              is_secret: true,
            }),
            headers: { "Content-Type": "application/json" },
          });
        } else {
          await fetch("/api/credentials", {
            method: "POST",
            body: JSON.stringify({
              client_id: clientId,
              provider: selectedService,
              variable_name: field.id,
              variable_value: field.value,
              is_secret: false,
            }),
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (error) {
        console.error("Error creating secret:", error);
        toast({
          title: "Error saving credentials",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }
    }
    toast({
      title: "Credentials saved successfully!",
      description:
        "You can now use these credentials to connect to the service.",
      variant: "default",
    });
  };

  const selectedServiceData = selectedService
    ? serviceCredentials[selectedService]
    : null;

  return (
    <div className="min-h-screen bg">
      <div className="flex gap-8">
        <div className="w-80">
          <ServiceSidebar
            services={services}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
          />
        </div>

        <CredentialForm
          service={selectedServiceData}
          onSave={handleSaveCredentials}
        />
      </div>
    </div>
  );
}

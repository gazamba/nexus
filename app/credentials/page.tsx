"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const initialServices: ThirdPartyService[] = [
  {
    id: "slack",
    name: "Slack",
    icon: <Slack className="w-5 h-5" />,
  },
  {
    id: "github",
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
  },
  {
    id: "jira",
    name: "Jira",
    icon: <Diamond className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: <Cloud className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "aws",
    name: "AWS",
    icon: <Zap className="w-5 h-5 text-orange-500" />,
  },
];

const providerCredentials: Record<string, ServiceCredentials> = {
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
        value: "",
        placeholder: "your-workspace.slack.com",
        required: true,
      },
      {
        id: "bot_token",
        label: "Bot User OAuth Token",
        type: "password",
        value: "",
        placeholder: "xoxb-your-bot-token",
        required: true,
        masked: true,
      },
      {
        id: "signing_secret",
        label: "Signing Secret",
        type: "password",
        value: "",
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
  const [provider, setProvider] =
    useState<ThirdPartyService[]>(initialServices);
  const [selectedService, setSelectedService] = useState<string>("slack");
  const [clientId, setClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFieldsLoading, setIsFieldsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getClientId(user.id).then(setClientId);
  }, [user?.id]);

  const fetchAllCredentials = useCallback(
    async (clientId: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/credentials?client_id=${clientId}`);
        const allCreds = await res.json();
        setProvider((provider) =>
          provider.map((service) => ({
            ...service,
            connected: allCreds.some(
              (cred: any) => cred.provider === service.id
            ),
          }))
        );
        Object.keys(providerCredentials).forEach((key) => {
          providerCredentials[key].connected = allCreds.some(
            (cred: any) => cred.provider === key
          );
        });
      } catch (error) {
        console.error("Error fetching credentials:", error);
        toast({
          title: "Error fetching credentials",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (clientId) fetchAllCredentials(clientId);
  }, [clientId, fetchAllCredentials]);

  const fetchFieldValues = useCallback(async () => {
    if (!clientId || !selectedService) return;
    const service = providerCredentials[selectedService];
    if (!service) return;

    setIsFieldsLoading(true);
    try {
      const values = await Promise.all(
        service.fields.map(async (field) => {
          const res = await fetch(
            `/api/credentials?client_id=${clientId}&provider=${selectedService}&variable_name=${field.id}`
          );
          const creds = await res.json();
          if (
            field.type === "password" &&
            creds.length > 0 &&
            creds[0].vault_key
          ) {
            return "**********";
          }
          return creds.length > 0 ? creds[0].variable_value || "" : "";
        })
      );
      service.fields = service.fields.map((field, idx) => ({
        ...field,
        value: values[idx],
      }));
      setProvider((provider) => [...provider]);
    } catch (error) {
      console.error("Error fetching field values:", error);
      toast({
        title: "Error fetching field values",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsFieldsLoading(false);
    }
  }, [clientId, selectedService, toast]);

  useEffect(() => {
    fetchFieldValues();
  }, [clientId, selectedService, fetchFieldValues]);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleSaveCredentials = async (
    serviceId: string,
    fields: CredentialField[]
  ) => {
    setIsSaving(true);
    try {
      providerCredentials[serviceId].fields = fields;

      const allRequiredFieldsFilled = fields
        .filter((field) => field.required)
        .every((field) => field.value.trim() !== "");

      setProvider(
        provider.map((service) =>
          service.id === serviceId
            ? { ...service, connected: allRequiredFieldsFilled }
            : service
        )
      );

      if (!clientId) {
        return;
      }

      for (const field of fields) {
        try {
          const response = await fetch(
            `/api/credentials?client_id=${clientId}&provider=${selectedService}&variable_name=${field.id}`
          );
          const credentials = await response.json();

          if (field.type === "password") {
            let oldVaultKey =
              credentials.length > 0 ? credentials[0].vault_key : null;

            if (oldVaultKey) {
              await fetch("/api/credentials/secret", {
                method: "DELETE",
                body: JSON.stringify({ vaultKey: oldVaultKey }),
                headers: { "Content-Type": "application/json" },
              });
            }

            let secretName = `${selectedService}_${field.id}_${Date.now()}`;
            const response = await fetch("/api/credentials/secret", {
              method: "POST",
              body: JSON.stringify({
                secretName: secretName,
                secretKey: field.value,
              }),
              headers: { "Content-Type": "application/json" },
            });
            const vaultKey = await response.json();

            if (credentials.length > 0) {
              await fetch("/api/credentials", {
                method: "PATCH",
                body: JSON.stringify({
                  client_id: clientId,
                  provider: selectedService,
                  variable_name: field.id,
                  vault_key: vaultKey,
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
                  vault_key: vaultKey,
                  is_secret: true,
                }),
                headers: { "Content-Type": "application/json" },
              });
            }
          } else {
            if (credentials.length > 0) {
              await fetch("/api/credentials", {
                method: "PATCH",
                body: JSON.stringify({
                  client_id: clientId,
                  provider: selectedService,
                  variable_name: field.id,
                  variable_value: field.value,
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
          }
        } catch (error) {
          console.error("Error saving credentials:", error);
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
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast({
        title: "Error saving credentials",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg">
      <div className="flex gap-8">
        <div className="w-80">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <ServiceSidebar
              services={provider}
              selectedService={selectedService}
              onServiceSelect={handleServiceSelect}
            />
          )}
        </div>

        {isLoading || isFieldsLoading ? (
          <Skeleton className="h-[400px] flex-1" />
        ) : (
          <CredentialForm
            service={providerCredentials[selectedService]}
            onSave={handleSaveCredentials}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}

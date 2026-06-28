/**
 * Asaas Gateway Integration Module
 * Safely wraps creation of customers, subscriptions, and cancellation requests.
 * Uses ASAAS_API_KEY env variable, defaulting to Sandbox environment if not specified.
 */

const getAsaasConfig = () => {
  const apiKey = process.env.ASAAS_API_KEY;
  const environment = process.env.ASAAS_ENV || 'sandbox'; // 'sandbox' or 'production'
  const baseUrl = environment === 'production' 
    ? 'https://api.asaas.com/v3' 
    : 'https://sandbox.asaas.com/v3';

  return { apiKey, baseUrl };
};

export interface AsaasCustomerInput {
  name: string;
  email: string;
  cpfCnpj?: string;
  phone?: string;
}

export interface AsaasSubscriptionInput {
  customer: string; // Customer ID
  billingType: 'CREDIT_CARD' | 'BOLETO' | 'PIX';
  value: number;
  nextDueDate: string; // YYYY-MM-DD
  cycle: 'MONTHLY' | 'YEARLY';
  description?: string;
}

/**
 * Creates a Customer on Asaas.
 */
export async function createCustomer(input: AsaasCustomerInput) {
  const { apiKey, baseUrl } = getAsaasConfig();

  if (!apiKey) {
    console.warn("ASAAS_API_KEY is not defined. Simulating customer creation in Sandbox mode.");
    return {
      id: `cus_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      name: input.name,
      email: input.email,
      dateCreated: new Date().toISOString(),
      simulated: true
    };
  }

  try {
    const res = await fetch(`${baseUrl}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        cpfCnpj: input.cpfCnpj || "00000000000",
        phone: input.phone,
        notificationDisabled: false
      })
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(`Asaas Customer Error: ${res.status} - ${errorMsg}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Failed to create customer on Asaas:", error);
    throw error;
  }
}

/**
 * Creates a Subscription on Asaas.
 */
export async function createSubscription(input: AsaasSubscriptionInput) {
  const { apiKey, baseUrl } = getAsaasConfig();

  if (!apiKey) {
    console.warn("ASAAS_API_KEY is not defined. Simulating subscription creation in Sandbox mode.");
    return {
      id: `sub_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      customer: input.customer,
      billingType: input.billingType,
      value: input.value,
      cycle: input.cycle,
      status: "ACTIVE",
      nextDueDate: input.nextDueDate,
      simulated: true
    };
  }

  try {
    const payload = {
      customer: input.customer,
      billingType: input.billingType,
      value: input.value,
      nextDueDate: input.nextDueDate,
      cycle: input.cycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
      description: input.description || "Assinatura do Plano ViralForge"
    };

    const res = await fetch(`${baseUrl}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(`Asaas Subscription Error: ${res.status} - ${errorMsg}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Failed to create subscription on Asaas:", error);
    throw error;
  }
}

/**
 * Cancels an active Asaas Subscription.
 */
export async function cancelSubscription(subscriptionId: string) {
  const { apiKey, baseUrl } = getAsaasConfig();

  if (!apiKey || subscriptionId.startsWith('sub_')) {
    console.warn(`ASAAS_API_KEY is not defined or sub is simulated (${subscriptionId}). Simulating subscription cancellation.`);
    return {
      id: subscriptionId,
      deleted: true,
      status: "CANCELED",
      simulated: true
    };
  }

  try {
    const res = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: "DELETE",
      headers: {
        "access_token": apiKey
      }
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(`Asaas Cancel Error: ${res.status} - ${errorMsg}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Failed to cancel subscription on Asaas:", error);
    throw error;
  }
}

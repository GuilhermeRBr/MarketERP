// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// App Configuration
export const APP_NAME = "Mercadinho GR";
export const APP_VERSION = "1.0.0";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Query Keys
export const QUERY_KEYS = {
  PRODUCTS: "products",
  USERS: "users",
  SALES: "sales",
  PAYMENTS: "payments",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

// Payment Types
export const PAYMENT_TYPES = {
  PIX: "pix",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  CASH: "cash",
  OTHER: "other",
} as const;

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  [PAYMENT_TYPES.PIX]: "PIX",
  [PAYMENT_TYPES.CREDIT_CARD]: "Cartão de Crédito",
  [PAYMENT_TYPES.DEBIT_CARD]: "Cartão de Débito",
  [PAYMENT_TYPES.CASH]: "Dinheiro",
  [PAYMENT_TYPES.OTHER]: "Outro",
};

// User Roles
export const USER_ROLES = {
  OWNER: "owner",
  EMPLOYEE: "employee",
} as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.OWNER]: "Dono",
  [USER_ROLES.EMPLOYEE]: "Funcionário",
};

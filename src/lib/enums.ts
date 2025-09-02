
export enum Account {
	CHECKING = "Checking Account",
	SAVINGS = "Savings Account",
	BUSINESS = "Business Account",
	JOINT = "Join Account",
	STUDENT = "Student Account",
	INVESTMENT = "Investment Account"
}

export enum TransactionType {
	DEPOSIT = "Deposit",
	WITHDRAWAL = "Withdrawal",
	TRANSFER = "Transfer",
	PAYMENT = "Payment",
	REFUND = "Refund",
	FEE = "Fee",
	INTEREST = "Interest",
	ADJUSTMENT = "Adjustment"
}

export enum TransactionCategory {
	GROCERIES = "Groceries",
	UTILITIES = "Utilities",
	RENT = "Rent",
	ENTERTAINMENT = "Entertainment",
	TRANSPORTATION = "Transportation",
	HEALTHCARE = "Healthcare",
	EDUCATION = "Education",
	OTHER = "Other"
}

export enum PaymentType {
	CREDIT_CARD = "Credit Card",
	DEBIT_CARD = "Debit Card",
	PAYPAL = "PayPal",
	BANK_TRANSFER = "Bank Transfer",
	CASH = "Cash",
	PIX = "Pix"
}

export const ErrorEnum = {
	BAD_REQUEST: { message: "Bad Request", status: 400 },
	UNAUTHORIZED: { message: "Unauthorized", status: 401 },
	FORBIDDEN: { message: "Access Denied", status: 403 },
	NOT_FOUND: { message: "Not Found", status: 404 },
	CONFLICT: { message: "Conflict", status: 409 },
	INTERNAL_SERVER_ERROR: { message: "Internal Server Error", status: 500 },
	USER_ALREADY_EXISTS: { message: "User Already Exists", status: 409 },
	INVALID_CREDENTIALS: { message: "Invalid Credentials", status: 401 },
	VALIDATION_ERROR: { message: "Validation Error", status: 400 },
	INSUFFICIENT_FUNDS: { message: "Insufficient Funds", status: 400 },
	ACCOUNT_BLOCKED: { message: "Account Blocked", status: 403 }
} as const;

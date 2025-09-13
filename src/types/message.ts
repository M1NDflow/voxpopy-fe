import { ApiResponse } from "./api";

export interface Message {
    id: string;
    text: string;
    isLoading?: boolean;
    timestamp: Date;
    responseData?: ApiResponse;
}
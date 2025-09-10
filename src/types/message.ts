import { ApiResponse } from "./api";

export interface Message {
    id: number;
    text: string;
    isLoading?: boolean;
    timestamp: Date;
    responseData?: ApiResponse;
}
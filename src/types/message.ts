import { ApiResponse } from "./api";

export interface Message {
    id: string;
    text: string;
    corrected_text: string;
    isLoading?: boolean;
    timestamp: Date;
    is_high_reasoning_effort?: boolean;
    responseData?: ApiResponse;
}
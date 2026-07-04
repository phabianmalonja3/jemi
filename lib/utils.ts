


import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";


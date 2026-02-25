export interface Tool {
  name: string;
  description: string;
  iconName: string;
  routeUrl: string;
}

export interface ToolGroup {
  groupName: string;
  tools: Tool[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: any;
  errors: any;
}